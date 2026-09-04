package com.alimberdi.backend.controller;

import com.alimberdi.backend.dto.request.LoginRequest;
import com.alimberdi.backend.dto.request.LogoutRequest;
import com.alimberdi.backend.dto.request.RefreshRequest;
import com.alimberdi.backend.dto.request.RegisterRequest;
import com.alimberdi.backend.dto.response.ApiResponse;
import com.alimberdi.backend.dto.response.AuthResponse;
import com.alimberdi.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody @Valid LoginRequest request) {
		AuthResponse response = authService.login(request);
		return buildResponse(response, HttpStatus.OK);
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody @Valid RegisterRequest request) {
		AuthResponse tokens = authService.register(request);
		return buildResponse(tokens, HttpStatus.CREATED);
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody @Valid RefreshRequest request) {
		if (request.refreshToken() == null || request.refreshToken().isBlank()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		AuthResponse tokens = authService.refresh(request.refreshToken());
		return buildResponse(tokens, HttpStatus.OK);
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<AuthResponse>> logout(@RequestBody @Valid LogoutRequest request) {
		if (request.refreshToken() != null) {
			authService.logout(request.refreshToken());
		}
		return ResponseEntity.noContent().build();
	}

	private ResponseEntity<ApiResponse<AuthResponse>> buildResponse(AuthResponse response, HttpStatus status) {
		return ResponseEntity
				.status(status)
				.body(new ApiResponse<>(response));
	}

}
