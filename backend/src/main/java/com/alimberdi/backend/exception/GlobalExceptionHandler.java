package com.alimberdi.backend.exception;

import com.alimberdi.backend.dto.response.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleNotFoundException(ResourceNotFoundException ex) {
		log.error("Not Found Error: {}", ex.getMessage(), ex);

		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ErrorResponse(
						HttpStatus.NOT_FOUND.value(),
						ex.getMessage()
				));
	}

	@ExceptionHandler(ResourceAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> handleAlreadyExistsException(ResourceAlreadyExistsException ex) {
		log.error("Already Exists Error: {}", ex.getMessage(), ex);

		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(new ErrorResponse(
						HttpStatus.CONFLICT.value(),
						ex.getMessage()
				));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
		log.warn("Validation Error: {}", ex.getMessage(), ex);

		Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
				.filter(error -> error.getDefaultMessage() != null)
				.collect(Collectors.toMap(
						FieldError::getField,
						FieldError::getDefaultMessage,
						(existingValue, newValue) -> existingValue
				));

		return ResponseEntity.badRequest()
				.body(new ErrorResponse(
						HttpStatus.BAD_REQUEST.value(),
						"Validation Error",
						errors
				));
	}

	@ExceptionHandler(ExpiredJwtException.class)
	public ResponseEntity<ErrorResponse> handleExpiredJwtException(ExpiredJwtException ex) {
		log.warn("Expired JWT Error: {}", ex.getMessage(), ex);

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ErrorResponse(
						HttpStatus.UNAUTHORIZED.value(),
						"JWT expired"
				));
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
		log.warn("Bad Credentials Error: {}", ex.getMessage(), ex);

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ErrorResponse(
						HttpStatus.UNAUTHORIZED.value(),
						"Invalid username or password"
				));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
		log.warn("Illegal Argument Error: {}", ex.getMessage(), ex);

		return ResponseEntity.badRequest()
				.body(new ErrorResponse(
						HttpStatus.BAD_REQUEST.value(),
						ex.getMessage()
				));
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
		log.warn("Access Denied Error: {}", ex.getMessage(), ex);

		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(new ErrorResponse(
						HttpStatus.FORBIDDEN.value(),
						ex.getMessage()
				));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
		log.error("Unexpected Error: {}", ex.getMessage(), ex);

		return ResponseEntity.internalServerError()
				.body(new ErrorResponse(
						HttpStatus.INTERNAL_SERVER_ERROR.value(),
						HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()
				));
	}

}
