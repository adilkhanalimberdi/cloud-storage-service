CREATE TABLE files
(
    id            UUID                        NOT NULL,
    name          VARCHAR(255)                NOT NULL,
    original_name VARCHAR(255)                NOT NULL,
    object_key    VARCHAR(255)                NOT NULL,
    extension     VARCHAR(255)                NOT NULL,
    content_type  VARCHAR(255)                NOT NULL,
    size          BIGINT                      NOT NULL,
    icon          VARCHAR(255)                NOT NULL,
    folder_id     UUID                        NOT NULL,
    updated_at    TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    created_at    TIMESTAMP(6) WITH TIME ZONE NOT NULL,

    CONSTRAINT pk_files PRIMARY KEY (id),
    CONSTRAINT uc_files_object_key UNIQUE (object_key),
    CONSTRAINT FK_FILES_ON_FOLDER FOREIGN KEY (folder_id) REFERENCES folders (id)
);

CREATE INDEX idx_file_folder_id ON files (folder_id);