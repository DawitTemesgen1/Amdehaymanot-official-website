# Bulk gallery sync (rsync — not HTTP)

Admin upload is too slow for multi‑GB archives. Use this pipeline instead:

1. **Compress locally** (RAW/JPG → webp + thumbs; huge size win)
2. **`rsync` over SSH** into `uploads/images/` (resumable, much faster than multipart POST)
3. **Register** albums in MySQL from `manifest.json`

Deploy already **excludes** `uploads/` so rsync here will not be wiped by backend deploys.

## Prerequisites

SSH from your PC to `amdehaqe@69.72.248.123`. If `Permission denied`:

1. GitHub → Actions → **Authorize Local SSH Key** → Run workflow  
2. Paste your public key (`cat ~/.ssh/id_ed25519.pub`)  
3. Retry SSH

Or import the same pubkey in cPanel → SSH Access.

**Disk:** cPanel quotas are limited. Compress first; do **not** rsync hundreds of GB of RAW/TIFF. Prefer curated album folders.

## Commands

From repo root (backend deps installed so `sharp` works):

```bash
cd backend && npm install

# One album folder
node scripts/bulkPrepareGallery.js \
  --source "/run/media/dawit/DRIVE/Day 1" \
  --album "Day 1" \
  --category "Events" \
  --out ../gallery-staging

# Or: each subdirectory under parent = one album (add --limit 20 to test)
node scripts/bulkPrepareGallery.js \
  --source "/run/media/dawit/DRIVE" \
  --parent \
  --category "Events" \
  --out ../gallery-staging \
  --limit 20

chmod +x ../scripts/push-gallery-rsync.sh
../scripts/push-gallery-rsync.sh ../gallery-staging
```

Scripts live in:

- [`scripts/bulkPrepareGallery.js`](scripts/bulkPrepareGallery.js)
- [`scripts/bulkRegisterGallery.js`](scripts/bulkRegisterGallery.js)
- [`../scripts/push-gallery-rsync.sh`](../scripts/push-gallery-rsync.sh)
