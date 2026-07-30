-- Run against the Amde Haymanot MySQL database (utf8mb4).
-- Safe to re-run: uses IF NOT EXISTS / conditional patterns where possible.

ALTER TABLE posts
  ADD COLUMN source VARCHAR(32) NOT NULL DEFAULT 'manual' AFTER category,
  ADD COLUMN telegram_chat_id BIGINT NULL AFTER source,
  ADD COLUMN telegram_message_id BIGINT NULL AFTER telegram_chat_id;

-- Idempotency for Telegram ingest (NULLs are allowed multiple times in MySQL UNIQUE)
ALTER TABLE posts
  ADD UNIQUE KEY uq_posts_telegram (telegram_chat_id, telegram_message_id);

CREATE TABLE IF NOT EXISTS post_translations (
  id INT NOT NULL AUTO_INCREMENT,
  post_id INT NOT NULL,
  lang CHAR(2) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_post_lang (post_id, lang),
  CONSTRAINT fk_post_translations_post
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
