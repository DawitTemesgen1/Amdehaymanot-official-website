const pool = require("../config/db.js");
const Message = {};

Message.create = async (data) => {
  const [result] = await pool.query("INSERT INTO messages SET ?", data);
  return { id: result.insertId, ...data };
};

Message.findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM messages ORDER BY submitted_at DESC");
  return rows;
};

module.exports = Message;