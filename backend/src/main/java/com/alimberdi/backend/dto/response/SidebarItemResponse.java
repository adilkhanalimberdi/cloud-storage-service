package com.alimberdi.backend.dto.response;

import com.alimberdi.backend.model.enums.Icon;

import java.time.Instant;
import java.util.UUID;

public record SidebarItemResponse(
		UUID id,
		String label,
		Icon icon,
		Instant createdAt
) {}
