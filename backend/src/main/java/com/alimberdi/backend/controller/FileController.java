package com.alimberdi.backend.controller;

import com.alimberdi.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

	private final FileService fileService;

	// TODO

}
