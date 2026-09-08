package com.alimberdi.backend.util;

import com.alimberdi.backend.exception.InvalidFileException;
import com.alimberdi.backend.model.enums.SupportedFileExtension;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TextFileValidator {

	public static SupportedFileExtension validate(String filename, byte[] contentBytes) {
		if (filename == null || !filename.contains(".")) {
			throw new InvalidFileException("Filename must have a valid extension.");
		}

		String extension = filename.substring(filename.lastIndexOf(".") + 1);
		SupportedFileExtension supportedExtension = SupportedFileExtension.fromExtension(extension)
				.orElseThrow(() -> new IllegalArgumentException("File extension ." + extension + " is not supported."));

		if (!supportedExtension.isTextBased()) {
			throw new InvalidFileException("Cannot create binary file type ." + extension + " from text content.");
		}

		if (contentBytes.length > supportedExtension.getMaxSizeBytes()) {
			throw new InvalidFileException("File content exceeds the limit for " + extension + " files.");
		}

		return supportedExtension;
	}

}
