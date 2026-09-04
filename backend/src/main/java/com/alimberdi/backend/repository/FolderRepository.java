package com.alimberdi.backend.repository;

import com.alimberdi.backend.model.entity.Folder;
import com.alimberdi.backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FolderRepository extends JpaRepository<Folder, UUID> {

	boolean existsByNameAndParentAndUser(String folderName, Folder parent, User user);

	List<Folder> findAllByUser_UsernameAndIsRoot(String username, boolean isRoot);

}
