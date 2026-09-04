package com.alimberdi.backend.dto.event;

import com.alimberdi.backend.model.entity.User;

public record UserRegisteredEvent(
		User user
) {}
