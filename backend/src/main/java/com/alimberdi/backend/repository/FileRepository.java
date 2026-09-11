package com.alimberdi.backend.repository;

import com.alimberdi.backend.model.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FileRepository extends JpaRepository<File, UUID> {

	@Query("SELECT COALESCE(SUM(f.size), 0) " +
			"FROM File f " +
			"WHERE f.folder.user.username = :username")
	long findUsedSpaceByUsername(@Param("username") String username);

	@Query("""
        SELECT f FROM File f
        JOIN FETCH f.folder fold
        JOIN FETCH fold.user
        LEFT JOIN FETCH f.originalFolder origFold
        WHERE f.id = :id AND fold.isTrashCan = false
    """)
	Optional<File> findByIdForRestore(@Param("id") UUID id);

}
