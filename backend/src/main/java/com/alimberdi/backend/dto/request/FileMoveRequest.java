package com.alimberdi.backend.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record FileMoveRequest(
		@NotNull
		UUID folderId
) {}
