package com.alimberdi.backend.util;

import com.alimberdi.backend.exception.InvalidFileException;
import com.alimberdi.backend.model.enums.SupportedFileExtension;
import lombok.experimental.UtilityClass;
import org.springframework.web.multipart.MultipartFile;

@UtilityClass
public class FileValidator {

	public static void validate(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new InvalidFileException("File cannot be empty.");
		}

		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || !originalFilename.contains(".")) {
			throw new InvalidFileException("File must have a valid extension.");
		}

		String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
		SupportedFileExtension supportedExtension = SupportedFileExtension.fromExtension(extension)
				.orElseThrow(() -> new InvalidFileException("File extension ." + extension + " is not supported."));

		String contentType = file.getContentType();
		if (contentType == null || !isMimeTypeMatching(contentType, supportedExtension)) {
			throw new InvalidFileException("Content-type " + contentType + " does not match extension ." + extension);
		}

		if (file.getSize() > supportedExtension.getMaxSizeBytes()) {
			long maxMb = supportedExtension.getMaxSizeBytes() / (1024 * 1024);
			throw new InvalidFileException("File " + originalFilename + " exceeds the maximum allowed size of " + maxMb + " MB.");
		}
	}

	private static boolean isMimeTypeMatching(String contentType, SupportedFileExtension supportedExtension) {
		if (supportedExtension == SupportedFileExtension.MD && contentType.equals("text/plain")) {
			return true;
		}
		return contentType.equalsIgnoreCase(supportedExtension.getMimeType());
	}

}
