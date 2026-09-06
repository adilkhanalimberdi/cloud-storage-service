package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.event.FileCreatedEvent;
import com.alimberdi.backend.dto.event.FilesUploadedEvent;
import com.alimberdi.backend.dto.request.FileCreateRequest;
import com.alimberdi.backend.dto.response.FileResponse;
import com.alimberdi.backend.exception.InvalidFileException;
import com.alimberdi.backend.mapper.FileMapper;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.model.entity.File;
import com.alimberdi.backend.model.entity.Folder;
import com.alimberdi.backend.model.enums.SupportedFileExtension;
import com.alimberdi.backend.repository.FileRepository;
import com.alimberdi.backend.util.FileValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLConnection;
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

	public FileResponse createFile(CustomUserDetails userDetails, FileCreateRequest request, UUID folderId) {
		// TODO: Validate extension, filename, content
		// TODO: Create a helper method to get the metadata

		Folder folder = folderService.getById(folderId);
		if (!folder.getUser().getId().equals(userDetails.getId())) {
			throw new AccessDeniedException("You cannot perform this action.");
		}

		String fileName = request.fileName();
		String content = request.content();

		String extension = fileName.contains(".")
				? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
				: "";
		SupportedFileExtension supportedExtension = SupportedFileExtension.fromExtension(extension)
				.orElseThrow(() -> new InvalidFileException("File extension ." + extension + " not supported."));

		String contentType = URLConnection.guessContentTypeFromName(fileName);
		if (contentType == null) contentType = "application/octet-stream";

		String objectKey = generateObjectKey(userDetails.getId(), folderId, fileName);
		long size = content == null ? 0L : content.getBytes(StandardCharsets.UTF_8).length;

		File file = File.builder()
				.name(fileName)
				.originalName(fileName)
				.objectKey(objectKey)
				.extension(extension)
				.contentType(contentType)
				.size(size)
				.icon(supportedExtension.getIcon())
				.folder(folder)
				.build();
		File created = fileRepository.save(file);
		eventPublisher.publishEvent(new FileCreatedEvent(created, request));

		return fileMapper.toResponse(created);
	}

	@Transactional(rollbackFor = Exception.class)
	public List<FileResponse> uploadFile(CustomUserDetails userDetails, List<MultipartFile> files, UUID folderId) {
		files.forEach(FileValidator::validate);

		Folder folder = folderService.getById(folderId);
		if (!folder.getUser().getId().equals(userDetails.getId())) {
			throw new AccessDeniedException("You cannot perform this action.");
		}

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

	private String generateObjectKey(UUID userId, UUID folderId, String originalFilename) {
		String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
		String folderName = (folderId != null) ? folderId.toString() : "root";
		String randomId = UUID.randomUUID().toString();

		return String.format("uploads/users/%s/folders/%s/%s_%s", userId, folderName, randomId, safeFilename);
	}

}
