const pool = require("../config/db.js");

const Course = {};

Course.create = async (data) => {
  const [result] = await pool.query("INSERT INTO courses SET ?", data);
  return { id: result.insertId, ...data };
};

Course.findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM courses ORDER BY createdAt DESC");
  return rows;
};

Course.findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
  return rows[0];
};

Course.update = async (id, data) => {
  const [result] = await pool.query("UPDATE courses SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

Course.delete = async (id) => {
  // Note: Assumes ON DELETE CASCADE is set for videos in your database schema
  const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = Course;