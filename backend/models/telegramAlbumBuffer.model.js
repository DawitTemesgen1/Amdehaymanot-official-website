const pool = require('../config/db.js');

const TelegramAlbumBuffer = {};

TelegramAlbumBuffer.upsertItem = async ({
  chatId,
  mediaGroupId,
  messageId,
  photoFileId,
  caption = null,
}) => {
  await pool.query(
    `INSERT INTO telegram_album_buffer (chat_id, media_group_id, message_id, photo_file_id, caption)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       photo_file_id = VALUES(photo_file_id),
       caption = COALESCE(VALUES(caption), caption)`,
    [chatId, String(mediaGroupId), messageId, photoFileId, caption]
  );
};

TelegramAlbumBuffer.getGroup = async (chatId, mediaGroupId) => {
  const [rows] = await pool.query(
    'SELECT * FROM telegram_album_buffer WHERE chat_id = ? AND media_group_id = ? ORDER BY message_id ASC',
    [chatId, String(mediaGroupId)]
  );
  return rows;
};

TelegramAlbumBuffer.clearGroup = async (chatId, mediaGroupId) => {
  await pool.query(
    'DELETE FROM telegram_album_buffer WHERE chat_id = ? AND media_group_id = ?',
    [chatId, String(mediaGroupId)]
  );
};

module.exports = TelegramAlbumBuffer;
