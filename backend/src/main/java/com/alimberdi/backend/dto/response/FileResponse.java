package com.alimberdi.backend.dto.response;

import com.alimberdi.backend.model.enums.FileIcon;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record FileResponse(
		UUID id,
		String name,
		String originalName,
		String objectKey,
		String extension,
		String contentType,
		Long size,
		FileIcon icon,
		Instant updatedAt,
		Instant createdAt
) {}
