package com.alimberdi.backend.dto.response;

import com.alimberdi.backend.model.enums.FileIcon;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record FileResponse(
		UUID id,
		String name,
		FileIcon icon,
		String type,
		BigDecimal size,
		Instant updatedAt,
		Instant createdAt
) {}
