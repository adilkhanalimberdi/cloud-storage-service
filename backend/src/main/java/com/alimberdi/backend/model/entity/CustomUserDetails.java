package com.alimberdi.backend.model.entity;

import lombok.Getter;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CustomUserDetails implements UserDetails {

	@Getter
	private final UUID id;
	private final String username;
	private final String password;
	private final boolean isEnabled;
	private final Collection<? extends GrantedAuthority> authorities;

	public CustomUserDetails(User user) {
		this.id = user.getId();
		this.username = user.getUsername();
		this.password = user.getPassword();
		this.isEnabled = user.isActive();
		this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
	}

	@Override
	@NullMarked
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	@NullMarked
	public String getUsername() {
		return username;
	}

	@Override
	public @Nullable String getPassword() {
		return password;
	}

	@Override
	public boolean isEnabled() {
		return isEnabled;
	}

}
