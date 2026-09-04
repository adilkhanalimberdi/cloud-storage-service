package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.request.SidebarItemCreateRequest;
import com.alimberdi.backend.dto.response.SidebarItemResponse;
import com.alimberdi.backend.event.UserRegisteredEvent;
import com.alimberdi.backend.mapper.SidebarItemMapper;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.model.entity.SidebarItem;
import com.alimberdi.backend.model.entity.User;
import com.alimberdi.backend.model.enums.Icon;
import com.alimberdi.backend.repository.SidebarItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SidebarItemService {

	private final UserService userService;
	private final SidebarItemRepository sidebarItemRepository;
	private final SidebarItemMapper sidebarItemMapper;

	private static final List<SidebarItem> DEFAULTS = List.of(
			SidebarItem.builder().label("Primary").icon(Icon.FOLDER).build(),
			SidebarItem.builder().label("Starred").icon(Icon.STAR).build(),
			SidebarItem.builder().label("Trash can").icon(Icon.TRASH).build()
	);

	public List<SidebarItemResponse> getAllByUsername(CustomUserDetails userDetails) {
		return sidebarItemMapper.toResponseList(
				sidebarItemRepository.findByUser_Username(userDetails.getUsername())
		);
	}

	public SidebarItemResponse create(CustomUserDetails userDetails, SidebarItemCreateRequest request) {
		User user = userService.getByUsername(userDetails.getUsername());
		SidebarItem item = SidebarItem.builder()
				.label(request.label())
				.icon(request.icon())
				.user(user)
				.build();

		return sidebarItemMapper.toResponse(
				sidebarItemRepository.save(item)
		);
	}

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleUserRegister(UserRegisteredEvent event) {
		initializeDefaultSidebarItems(event.user());
	}

	private void initializeDefaultSidebarItems(User user) {
		List<SidebarItem> itemsToSave = DEFAULTS.stream()
				.map(item -> SidebarItem.builder()
						.label(item.getLabel())
						.icon(item.getIcon())
						.user(user)
						.build())
				.toList();

		sidebarItemRepository.saveAll(itemsToSave);
	}

}
