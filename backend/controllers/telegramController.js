const Post = require('../models/post.model');
const Event = require('../models/event.model');
const PostTranslation = require('../models/postTranslation.model');
const EventTranslation = require('../models/eventTranslation.model');
const { manageTelegramPost } = require('../services/aiRewrite');
const {
  parseChannelMessage,
  downloadTelegramPhoto,
  isAllowedChannel,
} = require('../services/telegramIngest');

function verifyWebhookSecret(req) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true; // allow in local/dev if unset
  const got = req.get('X-Telegram-Bot-Api-Secret-Token');
  return got && got === expected;
}

async function processChannelMessage(message, { isEdit = false } = {}) {
  const parsed = parseChannelMessage(message);
  if (!parsed) return;

  if (!isAllowedChannel(parsed.chatId)) {
    console.log('[telegram] Ignoring chat', parsed.chatId);
    return;
  }

  if (!parsed.text && !parsed.photoFileId) {
    console.log('[telegram] Empty message ignored', parsed.messageId);
    return;
  }

  if (parsed.mediaGroupId && !parsed.text) {
    console.log(
      '[telegram] Ignoring album item without caption',
      parsed.messageId,
      'media_group_id=',
      parsed.mediaGroupId
    );
    return;
  }

  let imageUrl = null;
  if (parsed.photoFileId) {
    try {
      imageUrl = await downloadTelegramPhoto(parsed.photoFileId);
    } catch (err) {
      console.error('[telegram] photo download failed:', err.message);
    }
  }

  const managed = await manageTelegramPost({
    text: parsed.text,
    hasImage: Boolean(imageUrl),
  });

  if (managed.contentType === 'event' && managed.event?.event_date) {
    const existingEvent = await Event.findByTelegramIds(parsed.chatId, parsed.messageId);
    const en = managed.translations.en || Object.values(managed.translations)[0];
    const eventPayload = {
      title: en.title,
      description: en.description,
      location: en.location || managed.event.location || 'To be announced',
      event_date: managed.event.event_date,
      organizer: managed.event.organizer || null,
      source: 'telegram',
      telegram_chat_id: parsed.chatId,
      telegram_message_id: parsed.messageId,
      image_url: imageUrl || existingEvent?.image_url || null,
    };

    if (existingEvent) {
      delete eventPayload.id;
      delete eventPayload.createdAt;
      delete eventPayload.updatedAt;
      await Event.updateById(existingEvent.id, eventPayload);
      await EventTranslation.upsertMany(existingEvent.id, managed.translations);
      console.log('[telegram] Updated event', existingEvent.id, 'from message', parsed.messageId);
      return;
    }

    const createdEvent = await Event.create(eventPayload);
    await EventTranslation.upsertMany(createdEvent.id, managed.translations);
    console.log('[telegram] Created event', createdEvent.id, 'from message', parsed.messageId);
    return;
  }

  const translations = managed.translations;
  const en = translations.en || Object.values(translations)[0];
  const authorId = Number(process.env.TELEGRAM_AUTHOR_USER_ID) || 1;

  const existing = await Post.findByTelegramIds(parsed.chatId, parsed.messageId);

  if (existing) {
    const update = {
      title: en.title,
      content: en.content,
      category: managed.postCategory || existing.category || 'Telegram',
      source: 'telegram',
      telegram_chat_id: parsed.chatId,
      telegram_message_id: parsed.messageId,
      authorId: existing.authorId || authorId,
      image_url: imageUrl || existing.image_url || null,
    };
    // strip join fields if somehow present
    delete update.id;
    delete update.author;
    delete update.created_at;
    delete update.updated_at;

    await Post.updateById(existing.id, update);
    await PostTranslation.upsertMany(existing.id, translations);
    console.log('[telegram] Updated post', existing.id, 'from message', parsed.messageId);
    return;
  }

  if (isEdit) {
    // edited message we never ingested — create fresh
  }

  const created = await Post.create({
    title: en.title,
    content: en.content,
    category: managed.postCategory || 'Telegram',
    source: 'telegram',
    telegram_chat_id: parsed.chatId,
    telegram_message_id: parsed.messageId,
    authorId,
    image_url: imageUrl,
  });

  await PostTranslation.upsertMany(created.id, translations);
  console.log('[telegram] Created post', created.id, 'from message', parsed.messageId);
}

exports.webhookHealth = (req, res) => {
  res.json({ ok: true, service: 'telegram-webhook' });
};

exports.handleWebhook = async (req, res) => {
  if (!verifyWebhookSecret(req)) {
    return res.status(401).json({ message: 'Invalid webhook secret' });
  }

  // Ack immediately so Telegram does not retry while AI runs
  res.status(200).json({ ok: true });

  const update = req.body || {};
  setImmediate(async () => {
    try {
      if (update.channel_post) {
        await processChannelMessage(update.channel_post, { isEdit: false });
      } else if (update.edited_channel_post) {
        await processChannelMessage(update.edited_channel_post, { isEdit: true });
      }
    } catch (err) {
      console.error('[telegram] ingest error:', err);
    }
  });
};
