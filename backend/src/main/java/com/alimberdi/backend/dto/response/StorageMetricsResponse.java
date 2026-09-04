package com.alimberdi.backend.dto.response;

public record StorageMetricsResponse(
		long usedSpace,
		long totalSpace
) {}
