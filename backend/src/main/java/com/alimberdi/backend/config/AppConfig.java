package com.alimberdi.backend.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableJpaAuditing
@Configuration
public class AppConfig {

	@Value("${app.minio.endpoint}")
	private String minioEndpoint;

	@Value("${app.minio.username}")
	private String minioUsername;

	@Value("${app.minio.password}")
	private String minioPassword;

	@Bean
	public MinioClient minioClient() {
		return MinioClient.builder()
				.endpoint(minioEndpoint)
				.credentials(minioUsername, minioPassword)
				.build();
	}

}
