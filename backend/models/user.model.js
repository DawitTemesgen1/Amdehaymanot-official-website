const pool = require('../config/db');
const User = {};

User.create = async (userData) => {
    const { name, email, password = null, google_id = null, avatar_url = null } = userData;
    const [result] = await pool.query(
        "INSERT INTO users (name, email, password, google_id, avatar_url) VALUES (?, ?, ?, ?, ?)",
        [name, email, password, google_id, avatar_url]
    );
    return { id: result.insertId };
};

User.findByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

User.findByGoogleId = async (googleId) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE google_id = ?", [googleId]);
    return rows[0];
};

User.findById = async (id) => {
    const [rows] = await pool.query(
        "SELECT id, name, email, role, google_id, avatar_url, createdAt FROM users WHERE id = ?",
        [id]
    );
    return rows[0];
};

User.findAll = async () => {
    const [rows] = await pool.query(
        "SELECT id, name, email, role, google_id, avatar_url, createdAt FROM users"
    );
    return rows;
};

User.updateRole = async (id, role) => {
    const [result] = await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    return result.affectedRows;
};

User.linkGoogleAccount = async (id, { google_id, name, avatar_url }) => {
    const [result] = await pool.query(
        "UPDATE users SET google_id = ?, name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url) WHERE id = ?",
        [google_id, name || null, avatar_url || null, id]
    );
    return result.affectedRows;
};

User.updateProfileFromGoogle = async (id, { name, avatar_url }) => {
    const [result] = await pool.query(
        "UPDATE users SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url) WHERE id = ?",
        [name || null, avatar_url || null, id]
    );
    return result.affectedRows;
};

module.exports = User;
