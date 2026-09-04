package com.alimberdi.backend.model.entity;

import com.alimberdi.backend.model.enums.Icon;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sidebar_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SidebarItem {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String label;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Icon icon;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "user_id")
	private User user;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private Instant createdAt;

}
