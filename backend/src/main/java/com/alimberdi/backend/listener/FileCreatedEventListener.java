package com.alimberdi.backend.listener;

import com.alimberdi.backend.dto.event.FileCreatedEvent;
import com.alimberdi.backend.exception.MinioException;
import com.alimberdi.backend.model.entity.File;
import com.alimberdi.backend.service.MinioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileCreatedEventListener {

	private final MinioService minioService;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFileCreated(FileCreatedEvent event) {
		File file = event.file();
		byte[] contentBytes = event.contentBytes();

		try (InputStream inputStream = new ByteArrayInputStream(contentBytes)) {
			minioService.uploadFile(file.getObjectKey(), inputStream, contentBytes.length, file.getContentType());
		} catch (Exception ex) {
			log.error("Failed to handle file creating: {}", ex.getMessage(), ex);
			throw new MinioException("Failed to upload file to MinIO: " + file.getObjectKey(), ex);
		}
	}

}
