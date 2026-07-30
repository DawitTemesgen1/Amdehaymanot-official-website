const pool = require("../config/db.js");
const Event = {};

Event.create = async (newEvent) => {
    const [result] = await pool.query("INSERT INTO events SET ?", newEvent);
    return { id: result.insertId, ...newEvent };
};

Event.findByTelegramIds = async (chatId, messageId) => {
    const [rows] = await pool.query(
        "SELECT * FROM events WHERE telegram_chat_id = ? AND telegram_message_id = ? LIMIT 1",
        [chatId, messageId]
    );
    return rows[0] || null;
};

Event.getAll = async () => {
    const [rows] = await pool.query("SELECT * FROM events ORDER BY event_date ASC");
    return rows;
};

Event.findById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
    return rows[0];
};

Event.updateById = async (id, event) => {
    const [result] = await pool.query("UPDATE events SET ? WHERE id = ?", [event, id]);
    return result.affectedRows;
};

Event.remove = async (id) => {
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", id);
    return result.affectedRows;
};

module.exports = Event;