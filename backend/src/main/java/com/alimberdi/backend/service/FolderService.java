package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.event.FolderCreatedEvent;
import com.alimberdi.backend.dto.request.FolderCreateRequest;
import com.alimberdi.backend.dto.response.FolderResponse;
import com.alimberdi.backend.exception.ResourceAlreadyExistsException;
import com.alimberdi.backend.exception.ResourceNotFoundException;
import com.alimberdi.backend.mapper.FolderMapper;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.model.entity.Folder;
import com.alimberdi.backend.model.entity.User;
import com.alimberdi.backend.model.enums.FolderIcon;
import com.alimberdi.backend.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderService {

	private final FolderMapper folderMapper;
	private final FolderRepository folderRepository;

	private final UserService userService;

	private final ApplicationEventPublisher eventPublisher;

	private static final List<Folder> DEFAULTS = List.of(
			Folder.builder().name("Primary").icon(FolderIcon.DEFAULT).isRoot(true).build(),
			Folder.builder().name("Starred").icon(FolderIcon.STAR).isRoot(true).build(),
			Folder.builder().name("Trash can").icon(FolderIcon.TRASH).isRoot(true).build()
	);

	public List<FolderResponse> getAll(CustomUserDetails userDetails, boolean isRoot) {
		return folderMapper.toResponseList(
				folderRepository.findAllByUser_UsernameAndIsRoot(userDetails.getUsername(), isRoot)
		);
	}

	@Transactional(rollbackFor = Exception.class)
	public FolderResponse create(CustomUserDetails userDetails, FolderCreateRequest request) {
		User user = userService.getByUsername(userDetails.getUsername());
		Folder parent = null;
		if (request.parentId() != null) {
			parent = folderRepository.findById(request.parentId())
					.orElseThrow(() -> new ResourceNotFoundException("Parent folder not found."));
		}

		if (folderRepository.existsByNameAndParentAndUser(request.name(), parent, user)) {
			throw new ResourceAlreadyExistsException("Folder with name " + request.name() + " already exists in this folder.");
		}

		Folder folder = Folder.builder()
				.name(request.name())
				.icon(request.icon())
				.isRoot(request.parentId() == null)
				.parent(parent)
				.user(user)
				.build();

		Folder created = folderRepository.save(folder);
		eventPublisher.publishEvent(new FolderCreatedEvent(created));

		return folderMapper.toResponse(created);
	}

	@Transactional(rollbackFor = Exception.class)
	public void initializeDefaultFolders(User user) {
		List<Folder> foldersToSave = DEFAULTS.stream()
				.map(folder -> Folder.builder()
						.name(folder.getName())
						.icon(folder.getIcon())
						.isRoot(folder.isRoot())
						.user(user)
						.build())
				.toList();
		folderRepository.saveAll(foldersToSave);
	}

}
