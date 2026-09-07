package com.alimberdi.backend.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Optional;

@Getter
@RequiredArgsConstructor
public enum SupportedFileExtension {

	TXT("txt", "text/plain", FileIcon.TXT, 20 * 1024 * 1024L, true),
	MD("md", "text/markdown", FileIcon.TXT, 20 * 1024 * 1024L, true),
	JAVA("java", "text/x-java-source", FileIcon.TXT, 20 * 1024 * 1024L, true),
	JSON("json", "application/json", FileIcon.TXT, 20 * 1024 * 1024L, true),

	PNG("png", "image/png", FileIcon.IMG, 5 * 1024 * 1024L, false),
	JPG("jpg", "image/jpeg", FileIcon.IMG, 5 * 1024 * 1024L, false),
	JPEG("jpeg", "image/jpeg", FileIcon.IMG, 5 * 1024 * 1024L, false),
	WEBP("webp", "image/webp", FileIcon.IMG, 5 * 1024 * 1024L, false),

	PDF("pdf", "application/pdf", FileIcon.PDF, 20 * 1024 * 1024L, false);

	private final String extension;
	private final String mimeType;
	private final FileIcon icon;
	private final long maxSizeBytes;
	private final boolean textBased;

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
