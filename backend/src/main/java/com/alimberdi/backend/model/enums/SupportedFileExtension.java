package com.alimberdi.backend.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Optional;

@Getter
@RequiredArgsConstructor
public enum SupportedFileExtension {

	PNG("png", "image/png", FileIcon.IMG, 5 * 1024 * 1024L),
	JPG("jpg", "image/jpeg", FileIcon.IMG, 5 * 1024 * 1024L),
	JPEG("jpeg", "image/jpeg", FileIcon.IMG, 5 * 1024 * 1024L),
	WEBP("webp", "image/webp", FileIcon.IMG, 5 * 1024 * 1024L),

	PDF("pdf", "application/pdf", FileIcon.PDF, 20 * 1024 * 1024L),
	TXT("txt", "text/plain", FileIcon.TXT, 20 * 1024 * 1024L),
	MD("md", "text/markdown", FileIcon.TXT, 20 * 1024 * 1024L);

	private final String extension;
	private final String mimeType;
	private final FileIcon icon;
	private final long maxSizeBytes;

	public static Optional<SupportedFileExtension> fromExtension(String extension) {
		if (extension == null || extension.isBlank()) {
			return Optional.empty();
		}
		String cleaned = extension.trim().toLowerCase().replace(".", "");
		return Arrays.stream(values())
				.filter(e -> e.getExtension().equalsIgnoreCase(cleaned))
				.findFirst();
	}

}
