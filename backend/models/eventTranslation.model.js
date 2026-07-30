const pool = require('../config/db.js');
const { SITE_LANGS } = require('../constants/languages');

const EventTranslation = {};

EventTranslation.getByEventId = async (eventId) => {
  const [rows] = await pool.query(
    'SELECT lang, title, description, location FROM event_translations WHERE event_id = ?',
    [eventId]
  );
  const map = {};
  for (const row of rows) {
    map[row.lang] = {
      title: row.title,
      description: row.description,
      location: row.location,
    };
  }
  return map;
};

EventTranslation.getByEventIds = async (eventIds) => {
  if (!eventIds.length) return {};
  const [rows] = await pool.query(
    'SELECT event_id, lang, title, description, location FROM event_translations WHERE event_id IN (?)',
    [eventIds]
  );
  const byEvent = {};
  for (const row of rows) {
    if (!byEvent[row.event_id]) byEvent[row.event_id] = {};
    byEvent[row.event_id][row.lang] = {
      title: row.title,
      description: row.description,
      location: row.location,
    };
  }
  return byEvent;
};

EventTranslation.upsertMany = async (eventId, translations) => {
  if (!translations || typeof translations !== 'object') return;

  for (const lang of SITE_LANGS) {
    const entry = translations[lang];
    if (!entry || !entry.title || !entry.description) continue;

    await pool.query(
      `INSERT INTO event_translations (event_id, lang, title, description, location)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         location = VALUES(location)`,
      [eventId, lang, entry.title, entry.description, entry.location || '']
    );
  }
};

EventTranslation.removeByEventId = async (eventId) => {
  await pool.query('DELETE FROM event_translations WHERE event_id = ?', [eventId]);
};

module.exports = EventTranslation;
