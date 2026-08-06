const Post = require('../models/post.model');
const Event = require('../models/event.model');
const PostTranslation = require('../models/postTranslation.model');
const EventTranslation = require('../models/eventTranslation.model');
const ContentImage = require('../models/contentImage.model');
const TelegramAlbumBuffer = require('../models/telegramAlbumBuffer.model');
const Submission = require('../models/submission.model');
const Mezmur = require('../models/mezmur.model');
const { manageTelegramPost, processMezmurLyrics } = require('../services/aiRewrite');
const { scheduleAlbumProcessing } = require('../services/telegramAlbum');
const { convertAudio } = require('../services/audioConverter');
const {
  parseChannelMessage,
  parseDirectMessage,
  downloadTelegramPhoto,
  downloadTelegramFile,
  isAllowedChannel,
} = require('../services/telegramIngest');

function verifyWebhookSecret(req) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true;
  const got = req.get('X-Telegram-Bot-Api-Secret-Token');
  return got && got === expected;
}

async function downloadPhotos(fileIds = []) {
  const urls = [];
  for (const fileId of fileIds) {
    if (!fileId) continue;
    try {
      urls.push(await downloadTelegramPhoto(fileId));
    } catch (err) {
      console.error('[telegram] photo download failed:', err.message);
    }
  }
  return urls;
}

async function saveImages(contentType, contentId, imageUrls = [], primaryUrl = null) {
  const merged = [...new Set([primaryUrl, ...imageUrls].filter(Boolean))];
  await ContentImage.replaceForContent(contentType, contentId, merged);
  return merged[0] || null;
}

async function ingestParsedMessage(parsed, { isEdit = false, imageUrls = [] } = {}) {
  if (!parsed.text && imageUrls.length === 0) {
    console.log('[telegram] Empty message ignored', parsed.messageId);
    return;
  }

  const managed = await manageTelegramPost({
    text: parsed.text,
    hasImage: imageUrls.length > 0,
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
      image_url: imageUrls[0] || existingEvent?.image_url || null,
    };

    if (existingEvent) {
      delete eventPayload.id;
      delete eventPayload.createdAt;
      delete eventPayload.updatedAt;
      eventPayload.image_url = await saveImages(
        'event',
        existingEvent.id,
        imageUrls,
        eventPayload.image_url
      );
      await Event.updateById(existingEvent.id, eventPayload);
      await EventTranslation.upsertMany(existingEvent.id, managed.translations);
      console.log('[telegram] Updated event', existingEvent.id, 'from message', parsed.messageId, `images=${imageUrls.length}`);
      return;
    }

    const createdEvent = await Event.create(eventPayload);
    const cover = await saveImages('event', createdEvent.id, imageUrls, eventPayload.image_url);
    if (cover && cover !== createdEvent.image_url) {
      await Event.updateById(createdEvent.id, { image_url: cover });
    }
    await EventTranslation.upsertMany(createdEvent.id, managed.translations);
    console.log('[telegram] Created event', createdEvent.id, 'from message', parsed.messageId, `images=${imageUrls.length}`);
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
      image_url: imageUrls[0] || existing.image_url || null,
    };
    delete update.id;
    delete update.author;
    delete update.created_at;
    delete update.updated_at;

    update.image_url = await saveImages('post', existing.id, imageUrls, update.image_url);
    await Post.updateById(existing.id, update);
    await PostTranslation.upsertMany(existing.id, translations);
    console.log('[telegram] Updated post', existing.id, 'from message', parsed.messageId, `images=${imageUrls.length}`);
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
    image_url: imageUrls[0] || null,
  });

  const cover = await saveImages('post', created.id, imageUrls, created.image_url);
  if (cover && cover !== created.image_url) {
    await Post.updateById(created.id, { image_url: cover });
  }
  await PostTranslation.upsertMany(created.id, translations);
  console.log('[telegram] Created post', created.id, 'from message', parsed.messageId, `images=${imageUrls.length}`);
}

async function processAlbumGroup(chatId, mediaGroupId) {
  const items = await TelegramAlbumBuffer.getGroup(chatId, mediaGroupId);
  if (!items.length) return;

  const captionItem = items.find((item) => item.caption && String(item.caption).trim()) || items[0];
  const text = String(captionItem.caption || '').trim();
  const fileIds = items.map((item) => item.photo_file_id).filter(Boolean);
  const imageUrls = await downloadPhotos(fileIds);

  await TelegramAlbumBuffer.clearGroup(chatId, mediaGroupId);

  await ingestParsedMessage(
    {
      chatId,
      messageId: captionItem.message_id,
      text,
      mediaGroupId,
      photoFileId: fileIds[0] || null,
    },
    { imageUrls }
  );
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

  if (parsed.mediaGroupId && parsed.photoFileId) {
    await TelegramAlbumBuffer.upsertItem({
      chatId: parsed.chatId,
      mediaGroupId: parsed.mediaGroupId,
      messageId: parsed.messageId,
      photoFileId: parsed.photoFileId,
      caption: parsed.text || null,
    });
    scheduleAlbumProcessing(parsed.chatId, parsed.mediaGroupId, processAlbumGroup);
    console.log('[telegram] Buffered album item', parsed.messageId, 'group=', parsed.mediaGroupId);
    return;
  }

  const imageUrls = parsed.photoFileId ? await downloadPhotos([parsed.photoFileId]) : [];
  await ingestParsedMessage(parsed, { isEdit, imageUrls });
}

async function processDirectMessage(message) {
  const parsed = parseDirectMessage(message);
  if (!parsed) return;

  if (!parsed.text && !parsed.audioFileId && !parsed.photoFileId) {
    return;
  }

  // If there's an audio or voice file, treat it as a Mezmur submission
  if (parsed.audioFileId) {
    try {
      console.log(`[telegram] Processing audio submission from ${parsed.userId}`);
      
      const { destPath, publicPath } = await downloadTelegramFile(parsed.audioFileId, 'audio');
      
      console.log(`[telegram] Audio downloaded to ${destPath}, converting...`);
      const { opusPath, m4aPath } = await convertAudio(destPath);
      
      let aiMetadata = {};
      let titleToSearch = 'Untitled Mezmur';
      let lyricsToSearch = parsed.text || '';
      
      if (parsed.text) {
        aiMetadata = await processMezmurLyrics(parsed.text);
        titleToSearch = aiMetadata.title || titleToSearch;
        lyricsToSearch = aiMetadata.formatted_lyrics || lyricsToSearch;
      }
      
      // Check for duplicates
      const duplicate = await Mezmur.findPotentialDuplicate(titleToSearch, lyricsToSearch.substring(0, 50));
      
      const submissionId = await Submission.create({
        telegram_user_id: parsed.userId,
        lyrics: parsed.text,
        original_audio: publicPath,
        opus_audio: opusPath,
        m4a_audio: m4aPath,
        ai_metadata: aiMetadata,
        duplicate_of: duplicate ? duplicate.id : null,
      });
      
      console.log(`[telegram] Created submission #${submissionId} for audio`);
      // Optional: you could use tgApi to send a message back to the user thanking them.
    } catch (err) {
      console.error('[telegram] Failed to process audio submission:', err);
    }
  }
}

exports.webhookHealth = (req, res) => {
  res.json({ ok: true, service: 'telegram-webhook' });
};

exports.handleWebhook = (req, res) => {
  if (!verifyWebhookSecret(req)) {
    return res.status(401).json({ message: 'Invalid webhook secret' });
  }

  res.status(200).json({ ok: true });

  const update = req.body || {};
  setImmediate(async () => {
    try {
      if (update.channel_post) {
        await processChannelMessage(update.channel_post, { isEdit: false });
      } else if (update.edited_channel_post) {
        await processChannelMessage(update.edited_channel_post, { isEdit: true });
      } else if (update.message) {
        await processDirectMessage(update.message);
      }
    } catch (err) {
      console.error('[telegram] ingest error:', err);
    }
  });
};
