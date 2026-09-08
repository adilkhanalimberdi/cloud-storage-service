package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.event.FileCreatedEvent;
import com.alimberdi.backend.dto.event.FileDeletedEvent;
import com.alimberdi.backend.dto.event.FilesUploadedEvent;
import com.alimberdi.backend.dto.request.FileCreateRequest;
import com.alimberdi.backend.dto.request.RenameFileRequest;
import com.alimberdi.backend.dto.response.FileResponse;
import com.alimberdi.backend.exception.InvalidFileException;
import com.alimberdi.backend.exception.ResourceNotFoundException;
import com.alimberdi.backend.mapper.FileMapper;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.model.entity.File;
import com.alimberdi.backend.model.entity.Folder;
import com.alimberdi.backend.model.enums.SupportedFileExtension;
import com.alimberdi.backend.repository.FileRepository;
import com.alimberdi.backend.util.FileValidator;
import com.alimberdi.backend.util.TextFileValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

	private final FileMapper fileMapper;
	private final FileRepository fileRepository;

	private final FolderService folderService;

	private final ApplicationEventPublisher eventPublisher;

	private File getById(UUID id) {
		return fileRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("File with id " + id + " not found."));
	}

	@Transactional(rollbackFor = Exception.class)
	public FileResponse createFile(CustomUserDetails userDetails, FileCreateRequest request, UUID folderId) {
		byte[] contentBytes = request.content().getBytes(StandardCharsets.UTF_8);
		SupportedFileExtension supportedExtension = TextFileValidator.validate(request.fileName(), contentBytes);

		Folder folder = folderService.getById(folderId);
		checkFolderAccess(folder, userDetails.getId());

		String objectKey = generateObjectKey(userDetails.getId(), folderId, request.fileName());

		File file = File.builder()
				.name(request.fileName())
				.originalName(request.fileName())
				.objectKey(objectKey)
				.extension(supportedExtension.getExtension())
				.contentType(supportedExtension.getMimeType())
				.size((long) contentBytes.length)
				.icon(supportedExtension.getIcon())
				.folder(folder)
				.build();
		File created = fileRepository.save(file);
		eventPublisher.publishEvent(new FileCreatedEvent(created, contentBytes));

		return fileMapper.toResponse(created);
	}

	@Transactional(rollbackFor = Exception.class)
	public List<FileResponse> uploadFile(CustomUserDetails userDetails, List<MultipartFile> files, UUID folderId) {
		files.forEach(FileValidator::validate);

		Folder folder = folderService.getById(folderId);
		checkFolderAccess(folder, userDetails.getId());

		List<File> filesToSave = files.stream()
				.map(file -> {
					String originalName = Objects.requireNonNull(file.getOriginalFilename(), "Filename cannot be null");

					int dotIndex = originalName.lastIndexOf(".");
					String extension = (dotIndex != -1) ? originalName.substring(dotIndex + 1) : "";

					SupportedFileExtension supportedExtension = SupportedFileExtension.fromExtension(extension)
							.orElseThrow(() -> new InvalidFileException("File extension ." + extension + " not supported."));
					String objectKey = generateObjectKey(userDetails.getId(), folderId, originalName);

					return File.builder()
							.name(originalName)
							.originalName(originalName)
							.objectKey(objectKey)
							.extension(extension)
							.contentType(file.getContentType())
							.size(file.getSize())
							.icon(supportedExtension.getIcon())
							.folder(folder)
							.build();
				})
				.toList();

		List<File> created = fileRepository.saveAll(filesToSave);
		eventPublisher.publishEvent(new FilesUploadedEvent(created, files));

		return fileMapper.toResponseList(created);
	}

	@Transactional(rollbackFor = Exception.class)
	public FileResponse rename(CustomUserDetails userDetails, UUID id, RenameFileRequest request) {
		File file = getById(id);
		Folder folder = file.getFolder();

		checkFolderAccess(folder, userDetails.getId());

		file.setName(request.fileName());
		return fileMapper.toResponse(fileRepository.save(file));
	}

	@Transactional(rollbackFor = Exception.class)
	public void delete(CustomUserDetails userDetails, UUID id) {
		File file = getById(id);
		Folder folder = file.getFolder();

		checkFolderAccess(folder, userDetails.getId());

		eventPublisher.publishEvent(new FileDeletedEvent(file.getObjectKey()));
		fileRepository.delete(file);
	}

	private String generateObjectKey(UUID userId, UUID folderId, String originalFilename) {
		String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
		String folderName = (folderId != null) ? folderId.toString() : "root";
		String randomId = UUID.randomUUID().toString();

		final String OBJECT_KEY_FORMAT = "uploads/users/%s/folders/%s/%s_%s";
		return String.format(OBJECT_KEY_FORMAT, userId, folderName, randomId, safeFilename);
	}

	private void checkFolderAccess(Folder folder, UUID userId) {
		if (!folder.getUser().getId().equals(userId)) {
			throw new AccessDeniedException("You cannot perform this action.");
		}
	}

}
