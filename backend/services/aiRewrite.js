const https = require('https');
const { SITE_LANGS } = require('../constants/languages');

const LANG_LABELS = {
  en: 'English',
  am: 'Amharic',
  ti: 'Tigrinya',
  om: 'Afaan Oromo',
  ge: "Ge'ez",
  es: 'Spanish',
  fr: 'French',
  ar: 'Arabic',
};

function httpsJson(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method,
        headers: {
          ...headers,
          ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, text: data });
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/**
 * Rewrite a Telegram channel post into a publishable website item.
 * The AI can classify it as news or event, then produce translations and
 * structured event metadata when relevant.
 * @param {{ text: string, hasImage?: boolean }} input
 * @returns {Promise<{
 *   contentType: 'news' | 'event',
 *   postCategory: string,
 *   translations: Record<string, { title: string, content: string, location?: string }>,
 *   event: null | {
 *     title: string,
 *     description: string,
 *     event_date: string | null,
 *     location: string,
 *     organizer: string
 *   }
 * }>}
 */
async function manageTelegramPost({ text, hasImage = false }) {
  const raw = (text || '').trim();
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    console.warn('[aiRewrite] GEMINI_API_KEY missing — using raw manager fallback');
    return fallbackManagedResult(raw, hasImage);
  }

  if (!raw) {
    const title = hasImage ? 'Community photo update' : 'Community update';
    const content = hasImage
      ? 'A new photo was shared from our Sunday School community.'
      : 'A new update was shared from our Sunday School community.';
    return fallbackManagedResult(content, hasImage, title);
  }

  const langList = SITE_LANGS.map((code) => `${code} (${LANG_LABELS[code]})`).join(', ');

  const system = `You are the publishing manager for Amde Haymanot Sunday School (Ethiopian Orthodox Tewahedo), Jimma.
Your job is to decide whether a Telegram post should become a website news post or a website event.
Preserve facts, names, dates, times, locations, and scripture references. Do not invent missing details.
If the source is announcing a scheduled gathering, program, ceremony, meeting, class, celebration, or other time-bound activity, classify it as "event".
If it mainly reports, reflects on, or summarizes something that already happened or is a general update, classify it as "news".

For "news": write a short polished title and 1-3 paragraph body for each language.
For "event": write a clear title, a detailed description (2-4 paragraphs), and a location for EACH language. Event descriptions must include:
- what the event is and why it matters
- date and time (written naturally in the text)
- venue/location
- who is invited or who is organizing it
- any practical details from the source (dress, registration, contact, scripture, etc.)
Expand brief Telegram captions into full website-ready event pages. Do not leave descriptions as one short sentence.

Return ONLY valid JSON with this exact shape:
{
  "contentType": "news" or "event",
  "postCategory": "News" or another short label,
  "translations": {
    "en": { "title": "...", "content": "...", "location": "..." },
    "am": { "title": "...", "content": "...", "location": "..." }
  },
  "event": {
    "event_date": "YYYY-MM-DDTHH:mm:ss" or null,
    "organizer": "..."
  }
}
Languages required: ${langList}.
Use native script for Amharic, Tigrinya, Ge'ez, and Arabic. Keep Afaan Oromo in Latin script.
Body may use plain paragraphs separated by newlines. No markdown.
For "news", omit "location" or use an empty string, and set "event" to null.
For "event", include "location" in every translation entry. Put only machine-readable date/time in event.event_date and organizer name in event.organizer.
Only classify as "event" when there is enough evidence that the source is inviting or announcing a time-bound gathering.`;

  const user = `Source Telegram post text:
---
${raw}
---
${hasImage ? 'Note: the original post included a photo; mention imagery only if relevant.' : ''}`;

  const body = JSON.stringify({
    system_instruction: {
      parts: [{ text: system }],
    },
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: user }],
      },
    ],
  });

  try {
    const response = await httpsJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }
    );

    if (response.status < 200 || response.status >= 300) {
      console.error('[aiRewrite] Gemini error:', response.status, response.text);
      return fallbackManagedResult(raw, hasImage);
    }

    const data = JSON.parse(response.text);
    if (!data.candidates?.length) {
      console.error('[aiRewrite] Gemini returned no candidates:', response.text);
      return fallbackManagedResult(raw, hasImage);
    }
    const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    if (!content) {
      console.error('[aiRewrite] Gemini returned empty content:', response.text);
      return fallbackManagedResult(raw, hasImage);
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseErr) {
      console.error('[aiRewrite] Gemini returned non-JSON content:', content);
      throw parseErr;
    }
    return normalizeManagedResult(parsed, raw, hasImage);
  } catch (err) {
    console.error('[aiRewrite] failed:', err.message);
    return fallbackManagedResult(raw, hasImage);
  }
}

function fallbackBundle(raw, titleOverride) {
  const title =
    titleOverride ||
    (raw.split('\n').find((l) => l.trim()) || 'Community update').slice(0, 120);
  const content = raw || title;
  const bundle = {};
  for (const lang of SITE_LANGS) {
    bundle[lang] = { title, content };
  }
  return bundle;
}

function normalizeBundle(parsed, rawFallback) {
  const bundle = {};
  const en = parsed.en || parsed.EN;
  const baseTitle = (en?.title || rawFallback.split('\n')[0] || 'Community update').slice(0, 200);
  const baseContent = en?.content || rawFallback || baseTitle;
  const baseLocation = en?.location || '';

  for (const lang of SITE_LANGS) {
    const entry = parsed[lang] || {};
    bundle[lang] = {
      title: String(entry.title || baseTitle).slice(0, 500),
      content: String(entry.content || baseContent),
      location: String(entry.location || baseLocation).slice(0, 255),
    };
  }
  return bundle;
}

function toEventTranslations(translations) {
  const eventTranslations = {};
  for (const lang of SITE_LANGS) {
    const entry = translations[lang];
    if (!entry?.title || !entry?.content) continue;
    eventTranslations[lang] = {
      title: entry.title,
      description: entry.content,
      location: entry.location || '',
    };
  }
  return eventTranslations;
}

function fallbackManagedResult(raw, hasImage = false, titleOverride) {
  const title =
    titleOverride ||
    (raw.split('\n').find((l) => l.trim()) || (hasImage ? 'Community photo update' : 'Community update')).slice(0, 120);
  return {
    contentType: guessContentType(raw),
    postCategory: 'Telegram',
    translations: fallbackBundle(raw || title, title),
    event: null,
  };
}

function normalizeManagedResult(parsed, rawFallback, hasImage = false) {
  const translations = normalizeBundle(parsed.translations || parsed, rawFallback);
  const event = normalizeEventPayload(parsed.event);
  const contentType = normalizeContentType(parsed.contentType, event);

  return {
    contentType,
    postCategory: String(parsed.postCategory || 'Telegram').slice(0, 64),
    translations: contentType === 'event' ? toEventTranslations(translations) : translations,
    event: contentType === 'event' ? event : null,
  };
}

function normalizeContentType(value, event) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'event' && event?.event_date) return 'event';
  return 'news';
}

function normalizeEventPayload(event) {
  if (!event || typeof event !== 'object') return null;

  const eventDate = normalizeEventDate(event.event_date);
  return {
    event_date: eventDate,
    organizer: String(event.organizer || '').slice(0, 255),
    location: String(event.location || '').slice(0, 255),
  };
}

function normalizeEventDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function guessContentType(raw) {
  const text = String(raw || '').toLowerCase();
  if (!text) return 'news';

  const hasInvitation = /(join us|register|program|event|meeting|ceremony|celebration|service|conference|class|gathering|tomorrow|today|this sunday|starts at|located at|venue)/i.test(text);
  const hasDate = /\b\d{1,2}[:.]\d{2}\b|\b\d{4}-\d{2}-\d{2}\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text);

  return hasInvitation && hasDate ? 'event' : 'news';
}

module.exports = { manageTelegramPost, fallbackBundle };
