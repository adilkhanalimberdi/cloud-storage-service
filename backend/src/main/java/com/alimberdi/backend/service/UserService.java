package com.alimberdi.backend.service;

import com.alimberdi.backend.dto.request.RegisterRequest;
import com.alimberdi.backend.exception.UserNotFoundException;
import com.alimberdi.backend.model.entity.User;
import com.alimberdi.backend.model.enums.UserRole;
import com.alimberdi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public User getByUsername(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("User with username " + username + " not found"));
	}

	public User create(RegisterRequest request) {
		User user = User.builder()
				.username(request.username())
				.email(request.email())
				.password(passwordEncoder.encode(request.password()))
				.role(UserRole.USER)
				.isActive(true)
				.build();

		return userRepository.save(user);
	}

}
