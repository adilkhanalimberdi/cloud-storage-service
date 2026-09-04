package com.alimberdi.backend.dto.response;

public record AuthResponse(
		String accessToken,
		String refreshToken
) {}
