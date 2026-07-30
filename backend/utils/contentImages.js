const ContentImage = require('../models/contentImage.model');

async function attachImages(item, contentType, byContent) {
  if (!item) return item;
  const extra = byContent[item.id] || [];
  const fromTable = extra.map((img) => img.image_url);
  const merged = [...new Set([item.image_url, ...fromTable].filter(Boolean))];
  return {
    ...item,
    image_url: merged[0] || item.image_url || null,
    images: merged.map((url, index) => ({
      id: `${contentType}-${item.id}-${index}`,
      image_url: url,
      sort_order: index,
    })),
  };
}

async function attachImagesOne(item, contentType) {
  if (!item) return item;
  const byContent = await ContentImage.getByContents(contentType, [item.id]);
  return attachImages(item, contentType, byContent);
}

async function attachImagesMany(items, contentType) {
  if (!items.length) return items;
  const byContent = await ContentImage.getByContents(contentType, items.map((item) => item.id));
  return Promise.all(items.map((item) => attachImages(item, contentType, byContent)));
}

module.exports = {
  attachImagesOne,
  attachImagesMany,
};
