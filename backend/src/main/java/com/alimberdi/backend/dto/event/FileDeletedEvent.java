package com.alimberdi.backend.dto.event;

public record FileDeletedEvent(
		String objectKey
) {}
