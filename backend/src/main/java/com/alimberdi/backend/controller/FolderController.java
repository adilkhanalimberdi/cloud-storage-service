package com.alimberdi.backend.controller;

import com.alimberdi.backend.dto.request.FolderCreateRequest;
import com.alimberdi.backend.dto.request.FolderMoveRequest;
import com.alimberdi.backend.dto.response.ApiResponse;
import com.alimberdi.backend.dto.response.FolderResponse;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.service.FolderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/folders")
public class FolderController {

	private final FolderService folderService;

	@GetMapping
	public ResponseEntity<ApiResponse<List<FolderResponse>>> getAll(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestParam(name = "isRoot", defaultValue = "false", required = false) boolean isRoot
	) {
		return ResponseEntity
				.ok(new ApiResponse<>(folderService.getAll(userDetails, isRoot)));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<FolderResponse>> getById(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id
	) {
		return ResponseEntity
				.ok(new ApiResponse<>(folderService.getById(userDetails, id)));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<FolderResponse>> create(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestBody @Valid FolderCreateRequest request
	) {
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(folderService.create(userDetails, request)));
	}

	@PostMapping("/{id}/move")
	public ResponseEntity<ApiResponse<FolderResponse>> move(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id,
			@RequestBody @Valid FolderMoveRequest request
	) {
		return ResponseEntity
				.ok(new ApiResponse<>(folderService.move(userDetails, id, request)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id
	) {
		folderService.delete(userDetails, id);
		return ResponseEntity.noContent().build();
	}

}
