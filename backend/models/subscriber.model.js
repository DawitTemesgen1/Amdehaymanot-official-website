const pool = require("../config/db.js");
const Subscriber = {};

Subscriber.findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM subscribers WHERE email = ?", [email]);
  return rows[0];
};

Subscriber.create = async (data) => {
  const [result] = await pool.query("INSERT INTO subscribers SET ?", data);
  return { id: result.insertId, ...data };
};

Subscriber.findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM subscribers ORDER BY subscribed_at DESC");
  return rows;
};

module.exports = Subscriber;