package com.alimberdi.backend.model.entity;

import com.alimberdi.backend.model.enums.FolderIcon;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "folders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Folder {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private FolderIcon icon;

	@Column(nullable = false)
	private boolean isRoot;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private Folder parent;

	@OneToMany(mappedBy = "parent", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private List<Folder> subfolders = new ArrayList<>();

	@OneToMany(mappedBy = "folder", fetch = FetchType.EAGER, cascade =  CascadeType.ALL)
	private List<File> files = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private Instant createdAt;

}
