CREATE TABLE refresh_tokens
(
    id         UUID                        NOT NULL,
    token      VARCHAR(255)                NOT NULL,
    user_id    UUID,
    issued_at  TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    expiration TIMESTAMP(6) WITH TIME ZONE NOT NULL,

    CONSTRAINT pk_refresh_tokens PRIMARY KEY (id),
    CONSTRAINT uc_refresh_tokens_user UNIQUE (user_id),
    CONSTRAINT FK_REFRESH_TOKENS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);