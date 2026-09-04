package com.alimberdi.backend.mapper;

import com.alimberdi.backend.dto.response.SidebarItemResponse;
import com.alimberdi.backend.model.entity.SidebarItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
		componentModel = MappingConstants.ComponentModel.SPRING,
		nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface SidebarItemMapper {

	List<SidebarItemResponse> toResponseList(List<SidebarItem> sidebarItems);

	SidebarItemResponse toResponse(SidebarItem item);

}
