package com.alimberdi.backend.dto.request;

public record LoginRequest(
		String username,
		String password
) {}
