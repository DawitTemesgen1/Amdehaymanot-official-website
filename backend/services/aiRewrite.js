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
 * Rewrite a Telegram channel caption/body for the website and translate into all site languages.
 * @param {{ text: string, hasImage?: boolean }} input
 * @returns {Promise<Record<string, { title: string, content: string }>>}
 */
async function rewriteAndTranslate({ text, hasImage = false }) {
  const raw = (text || '').trim();
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    console.warn('[aiRewrite] OPENAI_API_KEY missing — using raw text fallback');
    return fallbackBundle(raw);
  }

  if (!raw) {
    const title = hasImage ? 'Community photo update' : 'Community update';
    const content = hasImage
      ? 'A new photo was shared from our Sunday School community.'
      : 'A new update was shared from our Sunday School community.';
    return fallbackBundle(content, title);
  }

  const langList = SITE_LANGS.map((code) => `${code} (${LANG_LABELS[code]})`).join(', ');

  const system = `You are an editor for Amde Haymanot Sunday School (Ethiopian Orthodox Tewahedo), Jimma.
Rewrite channel posts into clear, reverent website news articles.
Preserve facts, names, dates, and scripture references. Do not invent events.
Generate a short news title and polished body for each language.
Return ONLY valid JSON with this exact shape:
{
  "en": { "title": "...", "content": "..." },
  "am": { "title": "...", "content": "..." },
  ...
}
Languages required: ${langList}.
Use native script for Amharic, Tigrinya, Ge'ez, and Arabic. Keep Afaan Oromo in Latin script.
Body may use plain paragraphs separated by newlines. No markdown.`;

  const user = `Source Telegram post text:
---
${raw}
---
${hasImage ? 'Note: the original post included a photo; mention imagery only if relevant.' : ''}`;

  const body = JSON.stringify({
    model,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });

  try {
    const response = await httpsJson('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (response.status < 200 || response.status >= 300) {
      console.error('[aiRewrite] OpenAI error:', response.status, response.text);
      return fallbackBundle(raw);
    }

    const data = JSON.parse(response.text);
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallbackBundle(raw);

    const parsed = JSON.parse(content);
    return normalizeBundle(parsed, raw);
  } catch (err) {
    console.error('[aiRewrite] failed:', err.message);
    return fallbackBundle(raw);
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

  for (const lang of SITE_LANGS) {
    const entry = parsed[lang] || {};
    bundle[lang] = {
      title: String(entry.title || baseTitle).slice(0, 500),
      content: String(entry.content || baseContent),
    };
  }
  return bundle;
}

module.exports = { rewriteAndTranslate, fallbackBundle };
