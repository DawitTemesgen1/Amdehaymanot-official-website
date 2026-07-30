# Telegram → website posts

## One-time setup

1. Run the SQL migration on MySQL:

```bash
mysql -u USER -p DB_NAME < sql/001_telegram_i18n.sql
```

2. Copy `.env.example` to `.env` and fill values.

3. Create a bot with [@BotFather](https://t.me/BotFather), then add it as **admin** of your Sunday School channel.

4. Set the webhook (replace tokens/secrets):

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -d "url=https://api.amdehaymanot.com/api/telegram/webhook" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
  -d "allowed_updates=[\"channel_post\",\"edited_channel_post\"]"
```

5. `TELEGRAM_CHANNEL_ID` is the numeric chat id (often like `-100…`). Forward a channel post to `@userinfobot` or inspect webhook logs after a test post.

6. `TELEGRAM_AUTHOR_USER_ID` should be an existing admin user id in `users` (used as `authorId` on auto posts).

## Behaviour

- New channel posts are rewritten + translated with OpenAI and **auto-published**.
- Edits in Telegram update the same website post (matched by chat + message id).
- Admins can edit any language in `/admin/posts`.
