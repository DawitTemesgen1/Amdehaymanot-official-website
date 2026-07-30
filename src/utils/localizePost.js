/** Site languages that can have post translations */
export const POST_LANGS = [
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
 * Resolve title/content for the active UI language with fallbacks.
 * @param {{ title?: string, content?: string, translations?: Record<string, { title?: string, content?: string }> }} post
 * @param {string} language
 */
export function localizePost(post, language = 'en') {
  if (!post) return post;
  const translations = post.translations || {};
  const localized =
    translations[language] ||
    translations.en ||
    null;

  return {
    ...post,
    title: localized?.title || post.title,
    content: localized?.content || post.content,
  };
}

export function localizePosts(posts, language = 'en') {
  if (!Array.isArray(posts)) return posts;
  return posts.map((p) => localizePost(p, language));
}

/**
 * Build empty translation map seeded from optional base title/content.
 */
export function emptyTranslations(base = {}) {
  const map = {};
  for (const { code } of POST_LANGS) {
    map[code] = {
      title: code === 'en' ? base.title || '' : '',
      content: code === 'en' ? base.content || '' : '',
    };
  }
  return map;
}
