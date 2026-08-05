const pool = require('../config/db');

const MezmurCategory = {};

MezmurCategory.findAll = async () => {
    const [rows] = await pool.query("SELECT * FROM mezmur_categories ORDER BY sort_order ASC, id ASC");
    return rows;
};

MezmurCategory.findById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM mezmur_categories WHERE id = ?", [id]);
    return rows[0];
};

MezmurCategory.create = async (data) => {
    const { id, title_am, title_om, title_en, parent_id, sort_order } = data;
    const [result] = await pool.query(
        "INSERT INTO mezmur_categories (id, title_am, title_om, title_en, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
        [id, title_am || null, title_om || null, title_en || null, parent_id || null, sort_order || 0]
    );
    return { id: id };
};

MezmurCategory.update = async (id, data) => {
    const { title_am, title_om, title_en, parent_id, sort_order } = data;
    const [result] = await pool.query(
        "UPDATE mezmur_categories SET title_am = ?, title_om = ?, title_en = ?, parent_id = ?, sort_order = ? WHERE id = ?",
        [title_am || null, title_om || null, title_en || null, parent_id || null, sort_order || 0, id]
    );
    return result.affectedRows;
};

MezmurCategory.delete = async (id) => {
    const [result] = await pool.query("DELETE FROM mezmur_categories WHERE id = ?", [id]);
    return result.affectedRows;
};

module.exports = MezmurCategory;
