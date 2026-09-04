package com.alimberdi.backend.dto.event;

import com.alimberdi.backend.model.entity.Folder;

public record FolderCreatedEvent(
		Folder folder
) {}
