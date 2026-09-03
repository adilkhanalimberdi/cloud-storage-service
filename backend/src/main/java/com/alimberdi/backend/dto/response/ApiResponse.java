package com.alimberdi.backend.dto.response;

public record ApiResponse<T>(
		T data
) {}
