package com.alimberdi.backend.dto.request;

public record RegisterRequest(
		String username,
		String email,
		String password
) {}
