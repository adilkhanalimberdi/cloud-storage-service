package com.alimberdi.backend.listener;

import com.alimberdi.backend.dto.event.FilesUploadedEvent;
import com.alimberdi.backend.model.entity.File;
import com.alimberdi.backend.service.MinioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FilesUploadedEventListener {

	private final MinioService minioService;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFilesUploaded(FilesUploadedEvent event) {
		List<File> files = event.files();
		List<MultipartFile> multipartFiles = event.multipartFiles();
		for (int i = 0; i < files.size(); i++) {
			File file = files.get(i);
			MultipartFile multipartFile = multipartFiles.get(i);
			try {
				minioService.uploadFile(file.getObjectKey(), multipartFile, file.getContentType());
				log.info("Uploaded file {} to MinIO", file.getName());
			} catch (Exception ex) {
				log.error("Failed to upload file {} to MinIO: {}", file.getName(), ex.getMessage());
			}
		}
	}

}
