const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function getBotToken(isAppBot = false) {
  return isAppBot ? process.env.TELEGRAM_BOT_TOKEN_2 : process.env.TELEGRAM_BOT_TOKEN;
}

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
        res.on('end', () => resolve({ status: res.statusCode, text: data }));
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function tgApi(method, params = {}, isAppBot = false) {
  const token = getBotToken(isAppBot);
  if (!token) throw new Error(isAppBot ? 'TELEGRAM_BOT_TOKEN_2 is not set' : 'TELEGRAM_BOT_TOKEN is not set');
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const body = JSON.stringify(params);
  return httpsJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).then((res) => {
    const data = JSON.parse(res.text);
    if (!data.ok) {
      throw new Error(data.description || `Telegram API ${method} failed`);
    }
    return data.result;
  });
}

/**
 * Extract text/caption and optional photo file_id from a channel message.
 */
function parseChannelMessage(message) {
  if (!message) return null;

  const text = message.text || message.caption || '';
  let photoFileId = null;

  if (Array.isArray(message.photo) && message.photo.length > 0) {
    photoFileId = message.photo[message.photo.length - 1].file_id;
  } else if (message.document?.mime_type?.startsWith('image/')) {
    photoFileId = message.document.file_id;
  }

  return {
    chatId: message.chat?.id,
    messageId: message.message_id,
    text: String(text).trim(),
    mediaGroupId: message.media_group_id || null,
    photoFileId,
    date: message.date,
  };
}

function downloadToFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    const client = fileUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    client
      .get(fileUrl, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlink(destPath, () => {});
          return downloadToFile(res.headers.location, destPath).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(destPath, () => {});
          return reject(new Error(`Download failed with status ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(destPath)));
      })
      .on('error', (err) => {
        file.close();
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

/**
 * Download a Telegram file into uploads/images and return a public path like /uploads/images/...
 */
async function downloadTelegramPhoto(fileId) {
  const token = getBotToken();
  const file = await tgApi('getFile', { file_id: fileId });
  if (!file?.file_path) throw new Error('Telegram getFile returned no path');

  const ext = path.extname(file.file_path) || '.jpg';
  const dir = path.join(process.cwd(), 'uploads', 'images');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filename = `image-${Date.now()}${ext}`;
  const dest = path.join(dir, filename);
  const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

  await downloadToFile(fileUrl, dest);
  return `/uploads/images/${filename}`;
}

/**
 * Extract text, photo, audio, or voice from a direct message.
 */
function parseDirectMessage(message) {
  if (!message) return null;

  const text = message.text || message.caption || '';
  let photoFileId = null;
  let audioFileId = null;

  if (Array.isArray(message.photo) && message.photo.length > 0) {
    photoFileId = message.photo[message.photo.length - 1].file_id;
  } else if (message.document?.mime_type?.startsWith('image/')) {
    photoFileId = message.document.file_id;
  } else if (message.audio) {
    audioFileId = message.audio.file_id;
  } else if (message.voice) {
    audioFileId = message.voice.file_id;
  }

  return {
    chatId: message.chat?.id,
    messageId: message.message_id,
    userId: message.from?.id,
    text: String(text).trim(),
    mediaGroupId: message.media_group_id || null,
    photoFileId,
    audioFileId,
    date: message.date,
  };
}

/**
 * Download a Telegram file (photo, audio) into the specified directory.
 */
async function downloadTelegramFile(fileId, subDir = 'images', isAppBot = false) {
  const token = getBotToken(isAppBot);
  const file = await tgApi('getFile', { file_id: fileId }, isAppBot);
  if (!file?.file_path) throw new Error('Telegram getFile returned no path');

  const ext = path.extname(file.file_path) || (subDir === 'audio' ? '.ogg' : '.jpg');
  const dir = path.join(process.cwd(), 'uploads', subDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filename = `${subDir === 'audio' ? 'aud' : 'img'}-${Date.now()}${ext}`;
  const dest = path.join(dir, filename);
  const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

  await downloadToFile(fileUrl, dest);
  return { destPath: dest, publicPath: `/uploads/${subDir}/${filename}` };
}

function configuredChannelId() {
  const raw = process.env.TELEGRAM_CHANNEL_ID;
  if (!raw) return null;
  return Number(raw);
}

function isAllowedChannel(chatId) {
  const expected = configuredChannelId();
  if (expected == null || Number.isNaN(expected)) {
    console.warn('[telegram] TELEGRAM_CHANNEL_ID not set — rejecting all channel posts');
    return false;
  }
  return Number(chatId) === expected;
}

module.exports = {
  parseChannelMessage,
  parseDirectMessage,
  downloadTelegramPhoto: (fileId) => downloadTelegramFile(fileId, 'images').then(r => r.publicPath),
  downloadTelegramFile,
  isAllowedChannel,
  configuredChannelId,
  tgApi,
};
