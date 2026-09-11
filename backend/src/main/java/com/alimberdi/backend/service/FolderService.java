package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.event.FolderCreatedEvent;
import com.alimberdi.backend.dto.request.FolderCreateRequest;
import com.alimberdi.backend.dto.request.FolderMoveRequest;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FolderService {

	private final FolderMapper folderMapper;
	private final FolderRepository folderRepository;

	private final UserService userService;

	private final ApplicationEventPublisher eventPublisher;

	private static final List<Folder> DEFAULTS = List.of(
			Folder.builder().name("Primary").icon(FolderIcon.DEFAULT).isRoot(true).isTrashCan(false).isPrimary(true).build(),
			Folder.builder().name("Starred").icon(FolderIcon.STAR).isRoot(true).isTrashCan(false).isPrimary(false).build(),
			Folder.builder().name("Trash can").icon(FolderIcon.TRASH).isRoot(true).isTrashCan(true).isPrimary(false).build()
	);

	public List<FolderResponse> getAll(CustomUserDetails userDetails, boolean isRoot) {
		return folderMapper.toResponseList(
				folderRepository.findAllByUser_UsernameAndIsRoot(userDetails.getUsername(), isRoot)
		);
	}

	@Transactional(readOnly = true)
	public FolderResponse getById(CustomUserDetails userDetails, UUID id) {
		Folder folder = folderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Folder with id " + id + " not found."));
		checkFolderAccess(userDetails, folder);
		return folderMapper.toResponse(folder);
	}

	public Folder getById(UUID id) {
		return folderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Folder with id " + id + " not found."));
	}

	public Folder getTrashCanForUserId(UUID userId) {
		return folderRepository.findTrashCanByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Trash can folder not found for user with id " + userId));
	}

	@Transactional(rollbackFor = Exception.class)
	public FolderResponse create(CustomUserDetails userDetails, FolderCreateRequest request) {
		User user = userService.getByUsername(userDetails.getUsername());
		Folder parent = null;
		if (request.parentId() != null) {
			parent = getById(request.parentId());
			checkFolderAccess(userDetails, parent);
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
				.isTrashCan(false)
				.isPrimary(false)
				.build();

		Folder created = folderRepository.save(folder);
		eventPublisher.publishEvent(new FolderCreatedEvent(created));

		return folderMapper.toResponse(created);
	}

	@Transactional(rollbackFor = Exception.class)
	public FolderResponse move(CustomUserDetails userDetails, UUID id, FolderMoveRequest request) {
		Folder folder = getById(id);
		checkFolderAccess(userDetails, folder);

		Folder parent = null;
		if (request.parentId() != null) {
			parent = getById(request.parentId());
			checkFolderAccess(userDetails, parent);
		}

		folder.setParent(parent);
		return folderMapper.toResponse(folderRepository.save(folder));
	}

	@Transactional(rollbackFor = Exception.class)
	public void delete(CustomUserDetails userDetails, UUID id) {
		Folder folder = getById(id);
		checkFolderAccess(userDetails, folder);

		if (folder.isPrimary()) {
			throw new AccessDeniedException("You cannot delete the primary folder.");git a
		}

		if (folder.isTrashCan()) {
			throw new AccessDeniedException("You cannot delete the trash can folder.");
		}

		folderRepository.delete(folder);
	}

	public void initializeDefaultFolders(User user) {
		List<Folder> foldersToSave = DEFAULTS.stream()
				.map(folder -> Folder.builder()
						.name(folder.getName())
						.icon(folder.getIcon())
						.isRoot(folder.isRoot())
						.user(user)
						.isTrashCan(folder.isTrashCan())
						.isPrimary(folder.isPrimary())
						.build())
				.toList();
		folderRepository.saveAll(foldersToSave);
	}

	private void checkFolderAccess(CustomUserDetails userDetails, Folder folder) {
		if (!folder.getUser().getId().equals(userDetails.getId())) {
			throw new AccessDeniedException("You cannot perform this action.");
		}
	}

}
