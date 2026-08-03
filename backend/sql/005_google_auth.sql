-- Google OAuth support for users
-- Run once against the production/dev database.

ALTER TABLE `users`
  ADD COLUMN `google_id` VARCHAR(255) NULL AFTER `email`,
  ADD COLUMN `avatar_url` VARCHAR(512) NULL AFTER `google_id`;

ALTER TABLE `users`
  MODIFY `password` VARCHAR(255) NULL;

CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);
