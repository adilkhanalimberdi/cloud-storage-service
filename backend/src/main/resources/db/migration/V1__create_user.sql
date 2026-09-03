CREATE TABLE users
(
    id         UUID                        NOT NULL,
    username   VARCHAR(255)                NOT NULL,
    email      VARCHAR(255)                NOT NULL,
    password   VARCHAR(255)                NOT NULL,
    role       VARCHAR(255)                NOT NULL,
    is_active  BOOLEAN                     NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP(6) WITH TIME ZONE NOT NULL,

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uc_users_email UNIQUE (email),
    CONSTRAINT uc_users_username UNIQUE (username),
    CONSTRAINT chk_users_role CHECK ( role IN ('ADMIN', 'USER') )
);