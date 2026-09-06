package com.alimberdi.backend.service;

import com.alimberdi.backend.exception.MinioException;
import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

	@Value("${app.minio.bucket}")
	private String minioBucket;

	private final MinioClient minioClient;

	public void uploadFile(String objectKey, MultipartFile file, String contentType) {
		ensureBucketExists();
		try {
			minioClient.putObject(
					PutObjectArgs.builder()
							.bucket(minioBucket)
							.object(objectKey)
							.stream(file.getInputStream(), file.getSize(), (long) -1)
							.contentType(contentType)
							.build()
			);
		} catch (Exception ex) {
			throw new MinioException("Failed to upload file: " + objectKey, ex);
		}
	}

	private void ensureBucketExists() {
		try {
			boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(minioBucket).build());
			if (!exists) {
				minioClient.makeBucket(MakeBucketArgs.builder().bucket(minioBucket).build());
				log.info("Bucket {} created", minioBucket);
			}
		} catch (Exception ex) {
			log.error("Detailed MinIO error: ", ex);
			throw new MinioException("Failed to ensure bucket exists: " + minioBucket, ex);
		}
	}

}
