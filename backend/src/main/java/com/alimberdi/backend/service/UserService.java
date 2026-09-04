package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.request.RegisterRequest;
import com.alimberdi.backend.event.UserRegisteredEvent;
import com.alimberdi.backend.exception.UserNotFoundException;
import com.alimberdi.backend.model.entity.User;
import com.alimberdi.backend.model.enums.UserRole;
import com.alimberdi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final ApplicationEventPublisher eventPublisher;

	public User getByUsername(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("User with username " + username + " not found"));
	}

	@Transactional(rollbackFor = Exception.class)
	public User create(RegisterRequest request) {
		User user = User.builder()
				.username(request.username())
				.email(request.email())
				.password(passwordEncoder.encode(request.password()))
				.role(UserRole.USER)
				.isActive(true)
				.build();

		User created = userRepository.save(user);
		eventPublisher.publishEvent(new UserRegisteredEvent(created));

		return created;
	}

}
