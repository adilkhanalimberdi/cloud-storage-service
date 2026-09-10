package com.alimberdi.backend.repository;

import com.alimberdi.backend.model.entity.Folder;
import com.alimberdi.backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FolderRepository extends JpaRepository<Folder, UUID> {

	boolean existsByNameAndParentAndUser(String folderName, Folder parent, User user);

	@Query(value = "SELECT * " +
			"FROM folders " +
			"WHERE is_trash_can = true AND user_id = :userId",
			nativeQuery = true)
	Optional<Folder> findTrashCanByUserId(@Param("userId") UUID userId);

	List<Folder> findAllByUser_UsernameAndIsRoot(String username, boolean isRoot);

}
