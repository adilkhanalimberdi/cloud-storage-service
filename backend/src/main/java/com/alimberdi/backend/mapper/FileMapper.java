package com.alimberdi.backend.mapper;

import com.alimberdi.backend.dto.response.FileResponse;
import com.alimberdi.backend.model.entity.File;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
		componentModel = MappingConstants.ComponentModel.SPRING,
		nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface FileMapper {

	FileResponse toResponse(File file);

	List<FileResponse> toResponseList(List<File> files);

}
