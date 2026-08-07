const Post = require('../models/post.model');
const Event = require('../models/event.model');
const PostTranslation = require('../models/postTranslation.model');
const EventTranslation = require('../models/eventTranslation.model');
const ContentImage = require('../models/contentImage.model');
const TelegramAlbumBuffer = require('../models/telegramAlbumBuffer.model');
const Submission = require('../models/submission.model');
const Mezmur = require('../models/mezmur.model');
const { manageTelegramPost, processMezmurLyrics, handleConversationalAI } = require('../services/aiRewrite');
const { scheduleAlbumProcessing } = require('../services/telegramAlbum');
const { convertAudio } = require('../services/audioConverter');
const {
  parseChannelMessage,
  parseDirectMessage,
  downloadTelegramPhoto,
  downloadTelegramFile,
  isAllowedChannel,
  sendMessage,
  tgApi
} = require('../services/telegramIngest');
const BotSession = require('../models/botSession.model');

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
  if (!parsed || !parsed.userId) return;

  const session = await BotSession.getSession(parsed.userId);
  const lang = session.language === 'am' ? 'am' : 'en';

  const t = {
    welcome: lang === 'am' ? 'እንኳን በደህና መጡ! መዝሙር ለማስገባት በመጀመሪያ የመዝሙሩን ግጥም ይላኩልን።' : 'Welcome! To submit a Mezmur, please send the lyrics first.',
    sendAudio: lang === 'am' ? 'አመሰግናለሁ! አሁን የመዝሙሩን ድምጽ (Audio) ይላኩልን።' : 'Thank you! Now please send the audio file (voice message or MP3).',
    sendLyrics: lang === 'am' ? 'የመዝሙሩን ድምጽ ተቀብለናል! አሁን እባክዎ የመዝሙሩን ግጥም ይላኩልን።' : 'We received your audio. Please send the lyrics for this Mezmur.',
    success: lang === 'am' ? 'እናመሰግናለን! መዝሙርዎ ለግምገማ ቀርቧል። ሌላ መዝሙር ለማስገባት ከፈለጉ አዲሱን ግጥም ወይም ድምጽ አሁኑኑ መላክ ይችላሉ።' : 'Thank you! Your submission is under review. You can submit another Mezmur by simply sending the next lyrics or audio!',
    error: lang === 'am' ? 'ይቅርታ፣ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።' : 'Sorry, an error occurred. Please try again.',
  };

  // Handle /start command
  if (parsed.text === '/start') {
    await BotSession.resetSession(parsed.userId);
    await sendMessage(parsed.chatId, "Welcome to Amde Haymanot Mezmur Bot!\nPlease select your language / እባክዎ ቋንቋ ይምረጡ:", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "English", callback_data: "lang_en" },
            { text: "አማርኛ", callback_data: "lang_am" }
          ],
          [
            { text: "ትግርኛ", callback_data: "lang_ti" },
            { text: "Afaan Oromo", callback_data: "lang_om" }
          ],
          [
            { text: "ግዕዝ", callback_data: "lang_ge" },
            { text: "Español", callback_data: "lang_es" }
          ],
          [
            { text: "Français", callback_data: "lang_fr" },
            { text: "العربية", callback_data: "lang_ar" }
          ]
        ]
      }
    }, true);
    return;
  }

  // Handle /edit command
  if (parsed.text.startsWith('/edit')) {
    const query = parsed.text.replace('/edit', '').trim();
    if (!query) {
      await sendMessage(parsed.chatId, lang === 'am' ? 'እባክዎ ከመዝሙሩ ርዕስ ጋር አብረው ይላኩ። ለምሳሌ: /edit ኪዳነከ' : 'Please provide a search query. Example: /edit Kidaneke', {}, true);
      return;
    }
    const results = await Mezmur.searchForBot(query);
    if (results.length === 0) {
      await sendMessage(parsed.chatId, lang === 'am' ? 'የተጠየቀው መዝሙር አልተገኘም።' : 'No matching Mezmur found.', {}, true);
      return;
    }
    
    let messageText = lang === 'am' ? 'የተገኙ መዝሙሮች:\n\n' : 'Matching Mezmurs:\n\n';
    results.forEach((r, idx) => {
      messageText += `${idx + 1}. ${r.title || 'Untitled'}\n${r.content || ''}\n\n`;
    });
    if (messageText.length > 4000) {
      messageText = messageText.substring(0, 4000) + '\n... (truncated)';
    }
    messageText += lang === 'am' ? '\nየትኛውን መዝሙር ማስተካከል ይፈልጋሉ?' : '\nWhich Mezmur do you want to edit?';

    const inline_keyboard = results.map((r, idx) => ([{
      text: `${idx + 1}. ${r.title || 'Untitled'}`,
      callback_data: `edit_mezmur_${r.id}`
    }]));
    await sendMessage(parsed.chatId, messageText, {
      reply_markup: { inline_keyboard }
    }, true);
    return;
  }

  // Handle audio AND text sent together in a single message
  if (parsed.audioFileId && parsed.text) {
    await finalizeSubmission(parsed, session, parsed.text, parsed.audioFileId, t);
    return;
  }

  // Handle incoming text only
  if (parsed.text && !parsed.audioFileId && !parsed.photoFileId) {
    const aiResult = await handleConversationalAI(parsed.text, session.language);
    
    if (aiResult.intent === 'cancel') {
      await BotSession.resetSession(parsed.userId);
      await sendMessage(parsed.chatId, lang === 'am' ? 'ሒደቱ ተቋርጧል። ሌላ መዝሙር ለማስገባት ዝግጁ ነኝ።' : 'Submission cancelled. You can start over anytime.', {}, true);
      return;
    }

    if (session.state === 'idle' || session.state === 'waiting_lyrics') {
      if (aiResult.intent !== 'lyrics' && aiResult.response) {
         await sendMessage(parsed.chatId, aiResult.response, {}, true);
         return;
      }

      if (session.draft_audio_id) {
        // They sent audio first, now lyrics
        await finalizeSubmission(parsed, session, parsed.text, session.draft_audio_id, t);
      } else {
        // They sent lyrics first
        await BotSession.updateSession(parsed.userId, { state: 'waiting_audio', draft_lyrics: parsed.text });
        await sendMessage(parsed.chatId, t.sendAudio, {
          reply_markup: {
            inline_keyboard: [[ { text: lang === 'am' ? 'ድምጽ የለኝም (ዘለል)' : 'Skip Audio', callback_data: 'skip_audio' } ]]
          }
        }, true);
      }
      return;
    }

    if (session.state === 'waiting_audio') {
      if (aiResult.intent !== 'lyrics' && aiResult.response) {
         await sendMessage(parsed.chatId, aiResult.response, {}, true);
      } else {
         await sendMessage(parsed.chatId, t.sendAudio, {
          reply_markup: {
            inline_keyboard: [[ { text: lang === 'am' ? 'ድምጽ የለኝም (ዘለል)' : 'Skip Audio', callback_data: 'skip_audio' } ]]
          }
         }, true);
      }
      return;
    }

    if (session.state === 'editing_mezmur') {
      if (aiResult.intent !== 'lyrics' && aiResult.response) {
         await sendMessage(parsed.chatId, aiResult.response, {}, true);
         return;
      }
      await BotSession.updateSession(parsed.userId, { state: 'waiting_audio', draft_lyrics: parsed.text });
      await sendMessage(parsed.chatId, t.sendAudio, {
        reply_markup: {
          inline_keyboard: [[ { text: lang === 'am' ? 'ድምጽ የለኝም (ዘለል)' : 'Skip Audio', callback_data: 'skip_audio' } ]]
        }
      }, true);
      return;
    }
  }

  // Handle incoming audio only
  if (parsed.audioFileId && !parsed.text) {
    if (session.state === 'idle' || session.state === 'waiting_audio') {
      if (session.draft_lyrics) {
        // They sent lyrics first, now audio
        await finalizeSubmission(parsed, session, session.draft_lyrics, parsed.audioFileId, t);
      } else {
        // They sent audio first
        await BotSession.updateSession(parsed.userId, { state: 'waiting_lyrics', draft_audio_id: parsed.audioFileId });
        await sendMessage(parsed.chatId, t.sendLyrics, {}, true);
      }
      return;
    } else if (session.state === 'editing_mezmur') {
      // Audio only edit
      await finalizeSubmission(parsed, session, null, parsed.audioFileId, t);
      return;
    }
  }
}

async function finalizeSubmission(parsed, session, lyricsText, audioFileId, t) {
  try {
    await sendMessage(parsed.chatId, "Processing your submission... / በማስኬድ ላይ...", {}, true);
    
    let destPath = null, publicPath = null, opusPath = null, m4aPath = null;
    if (audioFileId) {
      const paths = await downloadTelegramFile(audioFileId, 'audio', true);
      destPath = paths.destPath;
      publicPath = paths.publicPath;
      const converted = await convertAudio(destPath);
      opusPath = converted.opusPath;
      m4aPath = converted.m4aPath;
    }
    
    let aiMetadata = await processMezmurLyrics(lyricsText);
    const titleToSearch = aiMetadata.title || 'Untitled Mezmur';
    const lyricsToSearch = aiMetadata.formatted_lyrics || lyricsText;
    
    const duplicate = await Mezmur.findPotentialDuplicate(titleToSearch, lyricsToSearch.substring(0, 50));
    
    await Submission.create({
      telegram_user_id: parsed.userId,
      lyrics: lyricsText,
      original_audio: publicPath,
      opus_audio: opusPath,
      m4a_audio: m4aPath,
      ai_metadata: aiMetadata,
      duplicate_of: session.target_mezmur_id || (duplicate ? duplicate.id : null),
    });
    
    await BotSession.resetSession(parsed.userId);
    await sendMessage(parsed.chatId, t.success, {}, true);
  } catch (err) {
    console.error('[telegram] Failed to process submission:', err);
    await sendMessage(parsed.chatId, t.error, {}, true);
  }
}

async function handleCallbackQuery(callbackQuery) {
  if (!callbackQuery || !callbackQuery.from) return;
  const data = callbackQuery.data;
  const userId = callbackQuery.from.id;
  const chatId = callbackQuery.message?.chat?.id;
  const queryId = callbackQuery.id;

  if (data.startsWith('lang_')) {
    const lang = data.replace('lang_', '');
    await BotSession.updateSession(userId, { language: lang, state: 'waiting_lyrics' });
    
    // Use tgApi directly to answer the callback query
    try {
      await tgApi('answerCallbackQuery', { callback_query_id: queryId }, true);
      const messages = {
        am: 'እንኳን በደህና መጡ! መዝሙር ለማስገባት በመጀመሪያ የመዝሙሩን ግጥም ይላኩልን።',
        en: 'Welcome! To submit a Mezmur, please send the lyrics first.',
        ti: 'እንቋዕ ብደሓን መጹ! መዝሙር ንምእታው በጃኹም ግጥሚ ስደዱ።',
        om: 'Baga nagaan dhuftan! Faarfannaa galchuuf jalqaba walaloo ergaa.',
        ge: 'እንቋዕ በደኃን መጻእክሙ! መዝሙር ለምእታው በቅድሚያ ግጥም ስደዱ።',
        es: '¡Bienvenido! Para enviar un Mezmur, por favor envíe la letra primero.',
        fr: 'Bienvenue ! Pour soumettre un Mezmur, veuillez d\'abord envoyer les paroles.',
        ar: 'مرحباً! لإرسال مزمور، يرجى إرسال الكلمات أولاً.'
      };
      const text = messages[lang] || messages['en'];
      await sendMessage(chatId, text, {}, true);
    } catch(e) {
      console.error('Callback error', e);
    }
  } else if (data === 'skip_audio') {
    try {
      await tgApi('answerCallbackQuery', { callback_query_id: queryId }, true);
      const session = await BotSession.getSession(userId);
      const lang = session.language === 'am' ? 'am' : 'en';
      const t = {
        success: lang === 'am' ? 'እናመሰግናለን! መዝሙርዎ ለግምገማ ቀርቧል። ሌላ መዝሙር ለማስገባት ከፈለጉ አዲሱን ግጥም ወይም ድምጽ አሁኑኑ መላክ ይችላሉ።' : 'Thank you! Your submission is under review. You can submit another Mezmur by simply sending the next lyrics or audio!',
        error: lang === 'am' ? 'ይቅርታ፣ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።' : 'Sorry, an error occurred. Please try again.',
      };
      
      if (session.state === 'waiting_audio' && session.draft_lyrics) {
        // They skipped sending audio, submit the draft lyrics
        await finalizeSubmission({ chatId, userId }, session, session.draft_lyrics, null, t);
      } else {
        await sendMessage(chatId, lang === 'am' ? 'ምንም የሚዘለል ነገር የለም።' : 'Nothing to skip.', {}, true);
      }
    } catch(e) {
      console.error('Skip Audio error', e);
    }
  } else if (data.startsWith('edit_mezmur_')) {
    const mezmurId = data.replace('edit_mezmur_', '');
    await BotSession.updateSession(userId, { state: 'editing_mezmur', target_mezmur_id: parseInt(mezmurId) });
    try {
      await tgApi('answerCallbackQuery', { callback_query_id: queryId }, true);
      const session = await BotSession.getSession(userId);
      const lang = session.language === 'am' ? 'am' : 'en';
      await sendMessage(chatId, lang === 'am' 
        ? 'የመረጡትን መዝሙር ለማስተካከል አዲሱን ግጥም ወይም ድምጽ ይላኩ።' 
        : 'Send the updated lyrics or a new audio file for this Mezmur.', {}, true);
    } catch(e) {
      console.error('edit_mezmur callback error', e);
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
      } else if (update.callback_query) {
        await handleCallbackQuery(update.callback_query);
      }
    } catch (err) {
      console.error('[telegram] ingest error:', err);
    }
  });
};
