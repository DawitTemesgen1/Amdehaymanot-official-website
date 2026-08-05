-- Mezmur App Offline-First Sync Database Schema

CREATE TABLE IF NOT EXISTS mezmur_categories (
  id         INT PRIMARY KEY,
  title_am   VARCHAR(255),
  title_om   VARCHAR(255),
  title_en   VARCHAR(255),
  parent_id  INT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mezmurs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  title       VARCHAR(500),
  content     LONGTEXT NOT NULL,
  language    ENUM('am','om','en') DEFAULT 'am',
  audio_url   VARCHAR(500) NULL,
  sort_order  INT DEFAULT 0,
  sync_version BIGINT NOT NULL DEFAULT 0,
  deleted_at  TIMESTAMP NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES mezmur_categories(id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mezmur_sync_counter (
  id              INT PRIMARY KEY DEFAULT 1,
  current_version BIGINT NOT NULL DEFAULT 0
);
