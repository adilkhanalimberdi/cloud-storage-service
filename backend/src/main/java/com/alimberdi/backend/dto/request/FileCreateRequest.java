package com.alimberdi.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record FileCreateRequest(
		@NotBlank(message = "Filename cannot be blank.")
		String fileName,

		@NotBlank(message = "File content cannot be blank.")
		String content
) {}
