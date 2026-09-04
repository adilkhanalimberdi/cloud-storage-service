CREATE TABLE folders
(
    id         UUID                        NOT NULL,
    name       VARCHAR(255)                NOT NULL,
    icon       VARCHAR(255)                NOT NULL,
    is_root    BOOLEAN                     NOT NULL,
    parent_id  UUID,
    user_id    UUID                        NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL,

    CONSTRAINT pk_folders PRIMARY KEY (id),
    CONSTRAINT FK_FOLDERS_ON_PARENT FOREIGN KEY (parent_id) REFERENCES folders (id),
    CONSTRAINT FK_FOLDERS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id)
);