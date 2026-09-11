package com.alimberdi.backend.dto.request;

import java.util.UUID;

public record FolderMoveRequest(
		UUID parentId
) {}
