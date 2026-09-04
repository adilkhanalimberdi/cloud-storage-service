package com.alimberdi.backend.dto.request;

import com.alimberdi.backend.model.enums.FolderIcon;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record FolderCreateRequest(
		@NotBlank(message = "Folder name cannot be blank.")
		@Size(max = 255, message = "Folder name must be at most 255 characters.")
		String name,

		@NotNull(message = "Folder icon cannot be null.")
		FolderIcon icon,

		UUID parentId
) {}
