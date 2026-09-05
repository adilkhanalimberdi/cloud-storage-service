package com.alimberdi.backend.dto.event;

import com.alimberdi.backend.model.entity.File;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record FilesUploadedEvent(
		List<File> files,
		List<MultipartFile> multipartFiles
) {}
