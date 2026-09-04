package com.alimberdi.backend.controller;

import com.alimberdi.backend.dto.response.ApiResponse;
import com.alimberdi.backend.dto.response.StorageMetricsResponse;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/storage")
public class StorageController {

	private final StorageService storageService;

	@GetMapping
	public ResponseEntity<ApiResponse<StorageMetricsResponse>> getUsedSpace(
			@AuthenticationPrincipal CustomUserDetails userDetails
	) {
		return ResponseEntity.ok(new ApiResponse<>(storageService.getMetrics(userDetails)));
	}

}
