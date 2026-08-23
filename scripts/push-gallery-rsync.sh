#!/usr/bin/env bash
# Fast push of prepared gallery staging → production uploads (rsync over SSH).
# Does NOT use the HTTP admin uploader.
#
# Usage:
#   ./scripts/push-gallery-rsync.sh ./gallery-staging
#   SSH_KEY=~/.ssh/id_ed25519 ./scripts/push-gallery-rsync.sh ./gallery-staging
#
# Requires SSH access to amdehaqe@69.72.248.123 (authorize your pubkey in cPanel).

set -euo pipefail

STAGING="${1:-}"
if [[ -z "$STAGING" || ! -d "$STAGING" ]]; then
  echo "Usage: $0 /path/to/gallery-staging"
  exit 1
fi

STAGING="$(cd "$STAGING" && pwd)"
SSH_HOST="${SSH_HOST:-69.72.248.123}"
SSH_USER="${SSH_USER:-amdehaqe}"
SSH_PORT="${SSH_PORT:-22}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
REMOTE_ROOT="${REMOTE_ROOT:-/home/amdehaqe/api.amdehaymanot.com}"

if [[ ! -f "$STAGING/manifest.json" ]]; then
  echo "Missing manifest.json in $STAGING — run bulkPrepareGallery.js first."
  exit 1
fi
if [[ ! -d "$STAGING/images" ]]; then
  echo "Missing images/ in $STAGING"
  exit 1
fi

SSH_OPTS=(-p "$SSH_PORT" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new)
if [[ -f "$SSH_KEY" ]]; then
  SSH_OPTS+=(-i "$SSH_KEY")
fi

echo "==> Checking SSH…"
ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" "mkdir -p '${REMOTE_ROOT}/uploads/images' '${REMOTE_ROOT}/uploads/_import' && df -h ~ | tail -1"

SIZE="$(du -sh "$STAGING/images" | awk '{print $1}')"
COUNT="$(find "$STAGING/images" -type f | wc -l)"
echo "==> Rsync ${COUNT} files (${SIZE}) → ${SSH_USER}@${SSH_HOST}:${REMOTE_ROOT}/uploads/images/"
echo "    (resumable; safe to re-run)"

rsync -avh --progress --partial --inplace \
  -e "ssh ${SSH_OPTS[*]}" \
  "$STAGING/images/" \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_ROOT}/uploads/images/"

echo "==> Upload manifest"
rsync -avh -e "ssh ${SSH_OPTS[*]}" \
  "$STAGING/manifest.json" \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_ROOT}/uploads/_import/manifest.json"

echo "==> Register albums in MySQL on server"
ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" bash -s <<EOF
set -euo pipefail
cd '${REMOTE_ROOT}'
NODE_BIN="/home/amdehaqe/nodevenv/api.amdehaymanot.com/20/bin/node"
if [[ ! -x "\$NODE_BIN" ]]; then NODE_BIN="\$(command -v node)"; fi
"\$NODE_BIN" scripts/bulkRegisterGallery.js --manifest uploads/_import/manifest.json
EOF

echo "==> Done. Open https://amdehaymanot.com/gallery (or your frontend) to verify."
