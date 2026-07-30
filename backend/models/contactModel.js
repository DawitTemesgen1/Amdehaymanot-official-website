const sql = require("../config/db.js");
module.exports = {
  create: (data, cb) => sql.query("INSERT INTO contact_messages SET ?", data, (err, res) => cb(err, { id: res?.insertId, ...data })),
  findAll: (cb) => sql.query("SELECT * FROM contact_messages ORDER BY submitted_at DESC", cb),
};