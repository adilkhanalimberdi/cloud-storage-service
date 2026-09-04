package com.alimberdi.backend.dto.response;

import com.alimberdi.backend.model.enums.FolderIcon;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record FolderResponse(
		UUID id,
		String name,
		FolderIcon icon,
		boolean isRoot,
		List<FolderResponse> subfolders,
		List<FileResponse> files,
		Instant createdAt
) {}
