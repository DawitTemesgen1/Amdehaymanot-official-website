const pool = require('../config/db');
const User = {};

User.create = async (userData) => {
    const { name, email, password } = userData;
    const [result] = await pool.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password]
    );
    return { id: result.insertId };
};

User.findByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

User.findById = async (id) => {
    const [rows] = await pool.query("SELECT id, name, email, role, createdAt FROM users WHERE id = ?", [id]);
    return rows[0];
};

User.findAll = async () => {
    const [rows] = await pool.query("SELECT id, name, email, role FROM users");
    return rows;
};

User.updateRole = async (id, role) => {
    const [result] = await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    return result.affectedRows;
};

module.exports = User;