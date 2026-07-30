/** Site languages that can have event translations */
export const EVENT_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ' },
  { code: 'ti', label: 'ትግርኛ' },
  { code: 'om', label: 'Afaan Oromo' },
  { code: 'ge', label: 'ግዕዝ' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

/**
 * Resolve title/description/location for the active UI language with fallbacks.
 */
export function localizeEvent(event, language = 'en') {
  if (!event) return event;
  const translations = event.translations || {};
  const localized = translations[language] || translations.en || null;

  return {
    ...event,
    title: localized?.title || event.title,
    description: localized?.description || event.description,
    location: localized?.location || event.location,
  };
}

export function localizeEvents(events, language = 'en') {
  if (!Array.isArray(events)) return events;
  return events.map((e) => localizeEvent(e, language));
}

export function emptyEventTranslations(base = {}) {
  const map = {};
  for (const { code } of EVENT_LANGS) {
    map[code] = {
      title: code === 'en' ? base.title || '' : '',
      description: code === 'en' ? base.description || '' : '',
      location: code === 'en' ? base.location || '' : '',
    };
  }
  return map;
}
