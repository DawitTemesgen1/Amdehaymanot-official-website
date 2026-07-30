const pool = require("../config/db");

const App = {};

App.createBuild = async (data) => {
  const { version, platform, architecture, notes, filePath } = data;
  const [result] = await pool.query(
    "INSERT INTO app_builds (version, platform, architecture, notes, file_path) VALUES (?, ?, ?, ?, ?)",
    [version, platform, architecture, notes, filePath]
  );
  return { id: result.insertId, ...data };
};

App.updateBuild = async (id, data) => {
  const [result] = await pool.query("UPDATE app_builds SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

App.deleteBuild = async (id) => {
  const [result] = await pool.query("DELETE FROM app_builds WHERE id = ?", [id]);
  return result.affectedRows;
};

App.findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM app_builds ORDER BY uploaded_at DESC");
  return rows;
};

App.findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM app_builds WHERE id = ?", [id]);
  return rows[0];
};

App.findByArchitecture = async (architecture) => {
  const [rows] = await pool.query("SELECT * FROM app_builds WHERE architecture = ?", [architecture]);
  return rows[0];
};

App.incrementDownloadCount = async (architecture) => {
  await pool.query("UPDATE app_builds SET downloads = downloads + 1 WHERE architecture = ?", [architecture]);
};

App.likeBuild = async (architecture) => {
  const [result] = await pool.query("UPDATE app_builds SET likes = likes + 1 WHERE architecture = ?", [architecture]);
  const [rows] = await pool.query("SELECT likes FROM app_builds WHERE architecture = ?", [architecture]);
  return rows[0];
};

App.getFeedback = async () => {
  const [comments] = await pool.query("SELECT * FROM app_comments ORDER BY created_at DESC LIMIT 50");
  const [likesResult] = await pool.query("SELECT SUM(likes) as totalLikes FROM app_builds");
  return {
    comments,
    totalLikes: likesResult[0].totalLikes || 0
  };
};

App.createComment = async (data) => {
  const { authorName, content } = data;
  const [result] = await pool.query("INSERT INTO app_comments (author_name, content) VALUES (?, ?)", [authorName, content]);
  return { id: result.insertId, ...data };
};

module.exports = App;