package com.alimberdi.backend.dto.request;

public record FileCreateRequest(
		String fileName,
		String content
) {}
