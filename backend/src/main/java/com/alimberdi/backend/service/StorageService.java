package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.response.StorageMetricsResponse;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StorageService {

	@Value("${app.storage.total-space}")
	private long totalSpace;

	private final FileRepository fileRepository;

	public StorageMetricsResponse getMetrics(CustomUserDetails userDetails) {
		long usedSpace = fileRepository.findUsedSpaceByUsername(userDetails.getUsername());
		return new StorageMetricsResponse(
				usedSpace,
				totalSpace
		);
	}

}
