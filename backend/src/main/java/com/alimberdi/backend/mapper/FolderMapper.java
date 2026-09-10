package com.alimberdi.backend.mapper;

import com.alimberdi.backend.dto.response.FolderResponse;
import com.alimberdi.backend.model.entity.Folder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
		componentModel = MappingConstants.ComponentModel.SPRING,
		nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface FolderMapper {

	@Mapping(target = "isRoot", source = "root")
	@Mapping(target = "isTrashCan", source = "trashCan")
	FolderResponse toResponse(Folder folder);

	List<FolderResponse> toResponseList(List<Folder> folder);

}
