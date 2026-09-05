package com.alimberdi.backend.listener;

import com.alimberdi.backend.dto.event.FilesUploadedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class FilesUploadedEventListener {

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFilesUploaded(FilesUploadedEvent event) {
		// TODO
	}

}
