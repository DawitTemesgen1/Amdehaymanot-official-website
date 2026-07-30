CREATE TABLE IF NOT EXISTS content_images (
  id INT NOT NULL AUTO_INCREMENT,
  content_type ENUM('post', 'event') NOT NULL,
  content_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_content_images_lookup (content_type, content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS telegram_album_buffer (
  id INT NOT NULL AUTO_INCREMENT,
  chat_id BIGINT NOT NULL,
  media_group_id VARCHAR(64) NOT NULL,
  message_id BIGINT NOT NULL,
  photo_file_id VARCHAR(255) NOT NULL,
  caption TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_telegram_album_msg (chat_id, message_id),
  KEY idx_telegram_album_group (chat_id, media_group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
