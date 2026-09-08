package com.alimberdi.backend.dto.event;

import com.alimberdi.backend.model.entity.File;

public record FileCreatedEvent(
		File file,
		byte[] contentBytes
) {}
