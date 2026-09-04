package com.alimberdi.backend.listener;

import com.alimberdi.backend.dto.event.UserRegisteredEvent;
import com.alimberdi.backend.service.FolderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserRegisteredEventListener {

	private final FolderService folderService;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void handleUserRegistered(UserRegisteredEvent event) {
		log.info("Initializing default folders for newly registered user: {}", event.user().getUsername());
		folderService.initializeDefaultFolders(event.user());
	}

}
