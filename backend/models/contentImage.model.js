const pool = require('../config/db.js');

const ContentImage = {};

ContentImage.getByContent = async (contentType, contentId) => {
  const [rows] = await pool.query(
    'SELECT id, image_url, sort_order FROM content_images WHERE content_type = ? AND content_id = ? ORDER BY sort_order ASC, id ASC',
    [contentType, contentId]
  );
  return rows;
};

ContentImage.getByContents = async (contentType, contentIds) => {
  if (!contentIds.length) return {};
  const [rows] = await pool.query(
    'SELECT content_id, id, image_url, sort_order FROM content_images WHERE content_type = ? AND content_id IN (?) ORDER BY sort_order ASC, id ASC',
    [contentType, contentIds]
  );
  const byContent = {};
  for (const row of rows) {
    if (!byContent[row.content_id]) byContent[row.content_id] = [];
    byContent[row.content_id].push({
      id: row.id,
      image_url: row.image_url,
      sort_order: row.sort_order,
    });
  }
  return byContent;
};

ContentImage.replaceForContent = async (contentType, contentId, imageUrls = []) => {
  await pool.query(
    'DELETE FROM content_images WHERE content_type = ? AND content_id = ?',
    [contentType, contentId]
  );
  const urls = [...new Set((imageUrls || []).filter(Boolean))];
  for (let i = 0; i < urls.length; i += 1) {
    await pool.query(
      'INSERT INTO content_images (content_type, content_id, image_url, sort_order) VALUES (?, ?, ?, ?)',
      [contentType, contentId, urls[i], i]
    );
  }
};

ContentImage.removeByContent = async (contentType, contentId) => {
  await pool.query(
    'DELETE FROM content_images WHERE content_type = ? AND content_id = ?',
    [contentType, contentId]
  );
};

module.exports = ContentImage;
