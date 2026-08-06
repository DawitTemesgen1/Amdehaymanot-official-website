const pool = require('../config/db');

const Submission = {};

Submission.findAll = async (page = 1, limit = 50, status = null) => {
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM submissions";
    const queryParams = [];
    
    if (status) {
        query += " WHERE status = ?";
        queryParams.push(status);
    }
    
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);
    
    const [rows] = await pool.query(query, queryParams);
    
    let countQuery = "SELECT COUNT(*) as total FROM submissions";
    if (status) {
        countQuery += " WHERE status = ?";
    }
    const [countRows] = await pool.query(countQuery, status ? [status] : []);
    
    return {
        data: rows,
        total: countRows[0].total,
        page,
        totalPages: Math.ceil(countRows[0].total / limit)
    };
};

Submission.findById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM submissions WHERE id = ?", [id]);
    return rows[0];
};

Submission.create = async (data) => {
    const { telegram_user_id, lyrics, original_audio, opus_audio, m4a_audio, ai_metadata, duplicate_of } = data;
    const [result] = await pool.query(
        "INSERT INTO submissions (telegram_user_id, lyrics, original_audio, opus_audio, m4a_audio, ai_metadata, duplicate_of, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')",
        [telegram_user_id, lyrics, original_audio, opus_audio, m4a_audio, JSON.stringify(ai_metadata || {}), duplicate_of || null]
    );
    return result.insertId;
};

Submission.updateStatus = async (id, status) => {
    const [result] = await pool.query(
        "UPDATE submissions SET status = ? WHERE id = ?",
        [status, id]
    );
    return result.affectedRows;
};

module.exports = Submission;
