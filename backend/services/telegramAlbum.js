const ALBUM_WAIT_MS = Number(process.env.TELEGRAM_ALBUM_WAIT_MS) || 3000;
const albumTimers = new Map();

function albumKey(chatId, mediaGroupId) {
  return `${chatId}:${mediaGroupId}`;
}

function scheduleAlbumProcessing(chatId, mediaGroupId, processFn) {
  const key = albumKey(chatId, mediaGroupId);
  if (albumTimers.has(key)) {
    clearTimeout(albumTimers.get(key));
  }

  const timer = setTimeout(async () => {
    albumTimers.delete(key);
    try {
      await processFn(chatId, mediaGroupId);
    } catch (err) {
      console.error('[telegram] album processing failed:', err.message);
    }
  }, ALBUM_WAIT_MS);

  albumTimers.set(key, timer);
}

module.exports = {
  scheduleAlbumProcessing,
  ALBUM_WAIT_MS,
};
