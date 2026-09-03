package com.alimberdi.backend.security;

import com.alimberdi.backend.dto.response.ErrorResponse;
import com.alimberdi.backend.service.CustomUserDetailsService;
import com.alimberdi.backend.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NullMarked;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final ObjectMapper objectMapper;
	private final CustomUserDetailsService userDetailsService;

	@Override
	@NullMarked
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain
	) throws ServletException, IOException {
		final String token, username;

		String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (auth == null || !auth.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		token = auth.substring(7);
		try {
			username = jwtService.extractUsername(token);
		} catch (JwtException | IllegalArgumentException e) {
			log.error("Failed to extract username from token: {}", e.getMessage(), e);
			filterChain.doFilter(request, response);
			return;
		}

		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);

			if (jwtService.isTokenValid(token, userDetails.getUsername())) {
				if (!userDetails.isEnabled()) {
					ErrorResponse errorResponse = new ErrorResponse(
							HttpStatus.UNAUTHORIZED.value(),
							"Account deactivated"
					);
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
					return;
				}

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						userDetails,
						null,
						userDetails.getAuthorities()
				);

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}

		filterChain.doFilter(request, response);
	}

}
