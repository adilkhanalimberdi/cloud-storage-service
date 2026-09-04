package com.alimberdi.backend.repository;

import com.alimberdi.backend.model.entity.SidebarItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SidebarItemRepository extends JpaRepository<SidebarItem, UUID> {

	List<SidebarItem> findByUser_Username(String username);

}
