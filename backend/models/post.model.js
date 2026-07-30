const pool = require('../config/db.js');

const Post = {};

Post.create = async (newPost) => {
  const [result] = await pool.query('INSERT INTO posts SET ?', newPost);
  return { id: result.insertId, ...newPost };
};

Post.getAll = async () => {
  const query = `
    SELECT p.*, u.name as author
    FROM posts p
    LEFT JOIN users u ON p.authorId = u.id
    ORDER BY p.created_at DESC`;
  const [rows] = await pool.query(query);
  return rows;
};

Post.findById = async (id) => {
  const query = `
    SELECT p.*, u.name as author
    FROM posts p
    LEFT JOIN users u ON p.authorId = u.id
    WHERE p.id = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

Post.findByTelegramIds = async (chatId, messageId) => {
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE telegram_chat_id = ? AND telegram_message_id = ? LIMIT 1',
    [chatId, messageId]
  );
  return rows[0] || null;
};

Post.updateById = async (id, post) => {
  const [result] = await pool.query('UPDATE posts SET ? WHERE id = ?', [post, id]);
  return result.affectedRows;
};

Post.remove = async (id) => {
  const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = Post;
