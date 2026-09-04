package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.request.LoginRequest;
import com.alimberdi.backend.dto.request.RegisterRequest;
import com.alimberdi.backend.dto.response.AuthResponse;
import com.alimberdi.backend.model.entity.RefreshToken;
import com.alimberdi.backend.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final JwtService jwtService;
	private final UserService userService;
	private final RefreshTokenService refreshTokenService;
	private final AuthenticationManager authenticationManager;

	@Transactional(rollbackFor = Exception.class)
	public AuthResponse login(LoginRequest request) {
		UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
				request.username(),
				request.password()
		);

		authenticationManager.authenticate(token);
		User user = userService.getByUsername(request.username());

		String access = jwtService.generateToken(user);
		String refresh = refreshTokenService.rotate(user).getToken();

		return new AuthResponse(access, refresh);
	}

	@Transactional(rollbackFor = Exception.class)
	public AuthResponse register(RegisterRequest request) {
		User user = userService.create(request);

		String access = jwtService.generateToken(user);
		String refresh = refreshTokenService.generate(user).getToken();

		return new AuthResponse(access, refresh);
	}

	@Transactional(rollbackFor = Exception.class)
	public AuthResponse refresh(String refreshToken) {
		RefreshToken oldToken = refreshTokenService.getByToken(refreshToken);
		User user = oldToken.getUser();

		String access = jwtService.generateToken(user);
		String refresh = refreshTokenService.rotate(user).getToken();

		return new AuthResponse(access, refresh);
	}

	public void logout(String refreshToken) {
		refreshTokenService.invalidate(refreshToken);
	}

}
