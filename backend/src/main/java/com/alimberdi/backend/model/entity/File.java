package com.alimberdi.backend.model.entity;

import com.alimberdi.backend.model.enums.FileIcon;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "files")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class File {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private FileIcon icon;

	private String type;

	private Long size;

	@ManyToOne
	@JoinColumn(name = "folder_id")
	private Folder folder;

	@LastModifiedDate
	@Column(nullable = false, updatable = false)
	private Instant updatedAt;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private Instant createdAt;

}
