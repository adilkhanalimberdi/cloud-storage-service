package com.alimberdi.backend.service;

import com.alimberdi.backend.exception.RefreshTokenNotFoundException;
import com.alimberdi.backend.model.entity.RefreshToken;
import com.alimberdi.backend.model.entity.User;
import com.alimberdi.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	@Value("${app.jwt.expiration.refresh-minutes}")
	private int refreshMinutes;

	private final RefreshTokenRepository refreshTokenRepository;

	public RefreshToken getByToken(String token) {
		return refreshTokenRepository.findByToken(token)
				.orElseThrow(() -> new RefreshTokenNotFoundException("Refresh token with token " + token + " not found."));
	}

	@Transactional(rollbackFor = Exception.class)
	public RefreshToken rotate(User user) {
		Instant issuedAt = Instant.now();
		Instant expiration = issuedAt.plus(refreshMinutes, ChronoUnit.MINUTES);
		String newToken = UUID.randomUUID().toString();

		RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
				.orElse(RefreshToken.builder()
						.user(user)
						.build());

		refreshToken.setToken(newToken);
		refreshToken.setIssuedAt(issuedAt);
		refreshToken.setExpiration(expiration);

		return refreshTokenRepository.save(refreshToken);
	}

	@Transactional(rollbackFor = Exception.class)
	public RefreshToken generate(User user) {
		return rotate(user);
	}

	public void invalidate(String token) {
		refreshTokenRepository.deleteByToken(token);
	}

}
