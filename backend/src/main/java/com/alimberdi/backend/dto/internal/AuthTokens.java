package com.alimberdi.backend.dto.internal;

public record AuthTokens(
		String accessToken,
		String refreshToken
) {}
