package com.alimberdi.backend.listener;

import com.alimberdi.backend.dto.event.FileCreatedEvent;
import com.alimberdi.backend.service.MinioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileCreatedEventListener {

	private final MinioService minioService;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFileCreated(FileCreatedEvent event) {
		// TODO: Implement the logic to upload the file to MinIO
	}

}
