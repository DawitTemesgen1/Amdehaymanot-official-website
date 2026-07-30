const pool = require("../config/db.js");
const Video = {};

Video.create = async (data) => {
  const [result] = await pool.query("INSERT INTO videos SET ?", data);
  return { id: result.insertId, ...data };
};

Video.findByCourseId = async (courseId) => {
  const [rows] = await pool.query("SELECT id, title FROM videos WHERE courseId = ? ORDER BY createdAt ASC", [courseId]);
  return rows;
};

Video.findDetailsById = async (videoId, userId) => {
    const [videoRows] = await pool.query("SELECT * FROM videos WHERE id = ?", [videoId]);
    if (!videoRows.length) return null;

    const video = videoRows[0];

    const commentsQuery = `
        SELECT c.*, u.name as author_name
        FROM comments c
        LEFT JOIN users u ON c.userId = u.id
        WHERE c.videoId = ? ORDER BY c.created_at DESC`;
    const [comments] = await pool.query(commentsQuery, [videoId]);

    const [likesResult] = await pool.query("SELECT COUNT(*) as likeCount FROM likes WHERE videoId = ?", [videoId]);
    const [userLikeResult] = await pool.query("SELECT id FROM likes WHERE videoId = ? AND userId = ?", [videoId, userId]);

    video.comments = comments;
    video.likes = likesResult[0].likeCount || 0;
    video.liked_by_user = userLikeResult.length > 0;

    return video;
};

Video.delete = async (id) => {
  const [result] = await pool.query("DELETE FROM videos WHERE id = ?", [id]);
  return result.affectedRows;
};

Video.findById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM videos WHERE id = ?", [id]);
    return rows[0];
};

Video.postComment = async (data) => {
    const [result] = await pool.query("INSERT INTO comments SET ?", data);
    return { id: result.insertId, ...data };
};

Video.findLike = async (videoId, userId) => {
    const [rows] = await pool.query("SELECT * FROM likes WHERE videoId = ? AND userId = ?", [videoId, userId]);
    return rows[0];
};

Video.addLike = async (videoId, userId) => {
    await pool.query("INSERT INTO likes (videoId, userId) VALUES (?, ?)", [videoId, userId]);
};

Video.removeLike = async (id) => {
    await pool.query("DELETE FROM likes WHERE id = ?", [id]);
};


module.exports = Video;