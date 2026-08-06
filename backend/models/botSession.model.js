const pool = require('../config/db');

class BotSession {
  static async getSession(userId) {
    const [rows] = await pool.query('SELECT * FROM telegram_bot_sessions WHERE telegram_user_id = ?', [userId]);
    if (rows.length === 0) {
      return this.createSession(userId);
    }
    return rows[0];
  }

  static async createSession(userId) {
    await pool.query('INSERT IGNORE INTO telegram_bot_sessions (telegram_user_id) VALUES (?)', [userId]);
    const [rows] = await pool.query('SELECT * FROM telegram_bot_sessions WHERE telegram_user_id = ?', [userId]);
    return rows[0];
  }

  static async updateSession(userId, data) {
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = Object.values(data);
    values.push(userId);
    
    await pool.query(`UPDATE telegram_bot_sessions SET ${fields} WHERE telegram_user_id = ?`, values);
    return this.getSession(userId);
  }

  static async resetSession(userId) {
    return this.updateSession(userId, { state: 'idle', draft_lyrics: null, draft_audio_id: null });
  }
}

module.exports = BotSession;
