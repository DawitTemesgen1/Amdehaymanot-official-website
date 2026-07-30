ALTER TABLE events
  ADD COLUMN source VARCHAR(32) NOT NULL DEFAULT 'manual' AFTER organizer,
  ADD COLUMN telegram_chat_id BIGINT NULL AFTER source,
  ADD COLUMN telegram_message_id BIGINT NULL AFTER telegram_chat_id;

ALTER TABLE events
  ADD UNIQUE KEY uq_events_telegram (telegram_chat_id, telegram_message_id);
