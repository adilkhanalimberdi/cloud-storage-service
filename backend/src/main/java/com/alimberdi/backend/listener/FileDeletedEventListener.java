package com.alimberdi.backend.listener;

import com.alimberdi.backend.dto.event.FileDeletedEvent;
import com.alimberdi.backend.service.MinioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileDeletedEventListener {

	private final MinioService minioService;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFileDeletedEvent(FileDeletedEvent event) {
		log.info("Deleting file from MinIO with object key: {}", event.objectKey());
		minioService.deleteFile(event.objectKey());
	}

}
