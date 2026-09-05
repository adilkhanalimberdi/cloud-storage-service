package com.alimberdi.backend.controller;

import com.alimberdi.backend.dto.response.ApiResponse;
import com.alimberdi.backend.dto.response.FileResponse;
import com.alimberdi.backend.model.entity.CustomUserDetails;
import com.alimberdi.backend.service.FileService;
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

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<List<FileResponse>>> uploadFile(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestParam("files") List<MultipartFile> files,
			@RequestParam("folderId") UUID folderId
	) {
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(new ApiResponse<>(fileService.uploadFile(userDetails, files, folderId)));
	}

}
