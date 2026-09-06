package com.alimberdi.backend.dto.event;

import com.alimberdi.backend.dto.request.FileCreateRequest;
import com.alimberdi.backend.model.entity.File;

public record FileCreatedEvent(
		File file,
		FileCreateRequest request
) {}
