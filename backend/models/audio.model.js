const pool = require('../config/db');

const Audio = {};

Audio.create = async (data, connection = null) => {
    const db = connection || pool;
    const { mezmur_id, opus_path, m4a_path, duration, sizes } = data;
    const [result] = await db.query(
        "INSERT INTO audio (mezmur_id, opus_path, m4a_path, duration, sizes) VALUES (?, ?, ?, ?, ?)",
        [mezmur_id, opus_path, m4a_path, duration || 0, JSON.stringify(sizes || {})]
    );
    return result.insertId;
};

Audio.findByMezmurId = async (mezmur_id) => {
    const [rows] = await pool.query("SELECT * FROM audio WHERE mezmur_id = ?", [mezmur_id]);
    return rows;
};

module.exports = Audio;
