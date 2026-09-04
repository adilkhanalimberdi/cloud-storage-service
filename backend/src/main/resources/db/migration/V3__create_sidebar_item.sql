CREATE TABLE sidebar_items
(
    id         UUID                        NOT NULL,
    label      VARCHAR(255)                NOT NULL,
    icon       VARCHAR(255)                NOT NULL,
    user_id    UUID                        NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL,

    CONSTRAINT pk_sidebar_items PRIMARY KEY (id),
    CONSTRAINT chk_sidebar_items_icon CHECK ( icon IN ('FOLDER', 'HARD_DRIVE', 'USERS', 'CLOCK', 'STAR', 'TRASH', 'TXT', 'PDF', 'IMAGE') ),
    CONSTRAINT fk_sidebar_items_on_user FOREIGN KEY (user_id) REFERENCES users (id)
);