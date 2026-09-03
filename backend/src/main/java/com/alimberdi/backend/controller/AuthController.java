package com.alimberdi.backend.controller;

import com.alimberdi.backend.dto.internal.AuthTokens;
import com.alimberdi.backend.dto.request.LoginRequest;
import com.alimberdi.backend.dto.request.RegisterRequest;
import com.alimberdi.backend.dto.response.ApiResponse;
import com.alimberdi.backend.dto.response.AuthResponse;
import com.alimberdi.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;

	@Value("${app.jwt.expiration.refresh-minutes}")
	private int refreshMinutes;

	@Value("${app.cookie.secure}")
	private boolean cookieSecure;

	@Value("${app.cookie.same-site}")
	private String cookieSameSite;

	@Value("${app.cookie.partitioned}")
	private boolean cookiePartitioned;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody @Valid LoginRequest request) {
		AuthTokens tokens = authService.login(request);
		return buildResponse(tokens, HttpStatus.OK);
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody @Valid RegisterRequest request) {
		AuthTokens tokens = authService.register(request);
		return buildResponse(tokens, HttpStatus.CREATED);
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<AuthResponse>> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
		AuthTokens tokens = authService.refresh(refreshToken);
		return buildResponse(tokens, HttpStatus.OK);
	}

	private ResponseEntity<ApiResponse<AuthResponse>> buildResponse(AuthTokens tokens, HttpStatus status) {
		AuthResponse response = new AuthResponse(tokens.accessToken());

		ResponseCookie cookie = ResponseCookie.from("refreshToken", tokens.refreshToken())
				.httpOnly(true)
				.secure(cookieSecure)
				.sameSite(cookieSameSite)
				.partitioned(cookiePartitioned)
				.path("/api/v1/auth")
				.maxAge(Duration.ofMinutes(refreshMinutes))
				.build();

		return ResponseEntity
				.status(status)
				.header(HttpHeaders.SET_COOKIE, cookie.toString())
				.body(new ApiResponse<>(response));
	}

}
