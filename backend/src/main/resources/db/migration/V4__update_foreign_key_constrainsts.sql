ALTER TABLE sidebar_items
    DROP CONSTRAINT fk_sidebar_items_on_user,
    ADD CONSTRAINT fk_sidebar_items_on_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE refresh_tokens
    DROP CONSTRAINT fk_refresh_tokens_on_user,
    ADD CONSTRAINT fk_refresh_tokens_on_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;