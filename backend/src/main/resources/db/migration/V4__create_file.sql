CREATE TABLE files
(
    id         UUID                        NOT NULL,
    name       VARCHAR(255)                NOT NULL,
    icon       VARCHAR(255)                NOT NULL,
    type       VARCHAR(255),
    size       BIGINT,
    folder_id  UUID,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,

    CONSTRAINT pk_files PRIMARY KEY (id),
    CONSTRAINT FK_FILES_ON_FOLDER FOREIGN KEY (folder_id) REFERENCES folders (id)
);