package com.alimberdi.backend.dto.request;

import com.alimberdi.backend.model.enums.Icon;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SidebarItemCreateRequest(
		@NotBlank(message = "Label cannot be blank.")
		@Size(max = 200, message = "Label must be at least 200 characters.")
		String label,

		@NotNull(message = "Icon cannot be null.")
		Icon icon
) {}
