package com.alimberdi.backend.controller;

import com.alimberdi.backend.dto.request.FileCreateRequest;
import com.alimberdi.backend.dto.request.FileMoveRequest;
import com.alimberdi.backend.dto.request.RenameFileRequest;
import com.alimberdi.backend.dto.response.ApiResponse;
import com.alimberdi.backend.dto.response.FileDownloadUrlResponse;
import com.alimberdi.backend.dto.response.FileResponse;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

	private final FileService fileService;

	@GetMapping("/{id}/download-url")
	public ResponseEntity<ApiResponse<FileDownloadUrlResponse>> getDownloadUrl(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id
	) {
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(new ApiResponse<>(fileService.getDownloadUrl(userDetails, id)));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<FileResponse>> create(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestBody FileCreateRequest request,
			@RequestParam("folderId") UUID folderId
	) {
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(fileService.create(userDetails, request, folderId)));
	}

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<List<FileResponse>>> upload(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestParam("files") List<MultipartFile> files,
			@RequestParam("folderId") UUID folderId
	) {
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(new ApiResponse<>(fileService.upload(userDetails, files, folderId)));
	}

	@PostMapping("/{id}/restore")
	public ResponseEntity<Void> restore(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id
	) {
		fileService.restore(userDetails, id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/rename")
	public ResponseEntity<ApiResponse<FileResponse>> rename(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id,
			@RequestBody @Valid RenameFileRequest request
	) {
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(new ApiResponse<>(fileService.rename(userDetails, id, request)));
	}

	@PostMapping("/{id}/move")
	public ResponseEntity<ApiResponse<FileResponse>> move(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id,
			@RequestBody @Valid FileMoveRequest request
	) {
		return ResponseEntity
				.ok(new ApiResponse<>(fileService.move(userDetails, id, request)));
	}

	@DeleteMapping("/{id}/soft")
	public ResponseEntity<Void> moveToTrash(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id
	) {
		fileService.moveToTrash(userDetails, id);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable UUID id
	) {
		fileService.delete(userDetails, id);
		return ResponseEntity.noContent().build();
	}

}
