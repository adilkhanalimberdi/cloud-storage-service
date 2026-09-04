package com.alimberdi.backend.event;

import com.alimberdi.backend.model.entity.User;

public record UserRegisteredEvent(User user) {
}
