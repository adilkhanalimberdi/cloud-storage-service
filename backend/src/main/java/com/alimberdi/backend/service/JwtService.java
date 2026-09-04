package com.alimberdi.backend.service;

import com.alimberdi.backend.model.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

	@Value("${app.jwt.secret-key}")
	private String secretKey;

	@Value("${app.jwt.expiration.access-minutes}")
	private int accessMinutes;

	private SecretKey getSigningKey() {
		byte[] bytes = secretKey.getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(bytes);
	}

	public String generateToken(User user) {
		Instant issuedAt = Instant.now();
		Instant expiration = issuedAt.plus(accessMinutes, ChronoUnit.MINUTES);
		return Jwts.builder()
				.subject(user.getUsername())
				.issuedAt(Date.from(issuedAt))
				.expiration(Date.from(expiration))
				.signWith(getSigningKey())
				.claim("role", user.getRole().name())
				.compact();
	}

	public String extractUsername(String token) {
		return extractAllClaims(token)
				.getSubject();
	}

	public boolean isTokenValid(String token, String subject) {
		Claims claims = extractAllClaims(token);
		return !isTokenExpired(claims) && subject.equals(claims.getSubject());
	}

	public boolean isTokenExpired(Claims claims) {
		return claims.getExpiration().before(Date.from(Instant.now()));
	}

	public Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

}
