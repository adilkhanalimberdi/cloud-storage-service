package com.alimberdi.backend.exception;

public class ResourceAlreadyExistsException extends RuntimeException {
	public ResourceAlreadyExistsException(String message) {
		super(message);
	}
}
