const pool = require('../config/db.js');
const { SITE_LANGS } = require('../constants/languages');

const PostTranslation = {};

PostTranslation.getByPostId = async (postId) => {
  const [rows] = await pool.query(
    'SELECT lang, title, content FROM post_translations WHERE post_id = ?',
    [postId]
  );
  const map = {};
  for (const row of rows) {
    map[row.lang] = { title: row.title, content: row.content };
  }
  return map;
};

PostTranslation.getByPostIds = async (postIds) => {
  if (!postIds.length) return {};
  const [rows] = await pool.query(
    'SELECT post_id, lang, title, content FROM post_translations WHERE post_id IN (?)',
    [postIds]
  );
  const byPost = {};
  for (const row of rows) {
    if (!byPost[row.post_id]) byPost[row.post_id] = {};
    byPost[row.post_id][row.lang] = { title: row.title, content: row.content };
  }
  return byPost;
};

/**
 * Replace all translations for a post.
 * @param {number} postId
 * @param {Record<string, { title: string, content: string }>} translations
 */
PostTranslation.upsertMany = async (postId, translations) => {
  if (!translations || typeof translations !== 'object') return;

  for (const lang of SITE_LANGS) {
    const entry = translations[lang];
    if (!entry || !entry.title || !entry.content) continue;

    await pool.query(
      `INSERT INTO post_translations (post_id, lang, title, content)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)`,
      [postId, lang, entry.title, entry.content]
    );
  }
};

PostTranslation.removeByPostId = async (postId) => {
  await pool.query('DELETE FROM post_translations WHERE post_id = ?', [postId]);
};

module.exports = PostTranslation;
