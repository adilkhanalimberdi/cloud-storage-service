package com.alimberdi.backend.mapper;

import com.alimberdi.backend.dto.response.FolderResponse;
import com.alimberdi.backend.model.entity.Folder;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
		componentModel = MappingConstants.ComponentModel.SPRING,
		nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface FolderMapper {

	FolderResponse toResponse(Folder folder);

	List<FolderResponse> toResponseList(List<Folder> folder);

}
