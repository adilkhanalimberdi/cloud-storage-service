package com.alimberdi.backend.exception;

public class RefreshTokenNotFoundException extends RuntimeException {
	public RefreshTokenNotFoundException(String message) {
		super(message);
	}
}
