package com.alimberdi.backend.controller;

import com.alimberdi.backend.dto.request.SidebarItemCreateRequest;
import com.alimberdi.backend.dto.response.ApiResponse;
import com.alimberdi.backend.dto.response.SidebarItemResponse;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.service.SidebarItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sidebar-items")
public class SidebarItemController {

	private final SidebarItemService sidebarItemService;

	@GetMapping
	public ResponseEntity<ApiResponse<List<SidebarItemResponse>>> getAll(
			@AuthenticationPrincipal CustomUserDetails userDetails
	) {
		return ResponseEntity
				.ok(new ApiResponse<>(sidebarItemService.getAllByUsername(userDetails)));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<SidebarItemResponse>> create(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestBody @Valid SidebarItemCreateRequest request
	) {
		return ResponseEntity
				.ok(new ApiResponse<>(sidebarItemService.create(userDetails, request)));
	}

}
