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
@Table(name = "files", indexes = {
		@Index(name = "idx_file_folder_id", columnList = "folder_id")
})
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
	private String originalName;

	@Column(nullable = false, unique = true)
	private String objectKey;

	@Column(nullable = false)
	private String extension;

	@Column(nullable = false)
	private String contentType;

	@Column(nullable = false)
	private Long size;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private FileIcon icon;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "folder_id", nullable = false)
	private Folder folder;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "original_folder_id", nullable = false)
	private Folder originalFolder;

	@LastModifiedDate
	@Column(nullable = false, updatable = false)
	private Instant updatedAt;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private Instant createdAt;

}
