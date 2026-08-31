#!/usr/bin/env bash
# Direct push: originals only, PARALLEL file transfers.
# Skips huge albums for later; skips albums already finished.
set -euo pipefail

ROOT="/home/dawit/projects/amdehaymanot official website"
DRIVE="/run/media/dawit/ዓምደ ሃይማኖተ ከ2015 ጀምሮ"
WORK="$DRIVE/.amde-gallery-direct-tmp"
LOG="$ROOT/gallery-upload.log"
BACKEND="$ROOT/backend"
PARALLEL="${PARALLEL:-6}"

SSH_HOST="${SSH_HOST:-69.72.248.123}"
SSH_USER="${SSH_USER:-amdehaqe}"
SSH_PORT="${SSH_PORT:-22}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
REMOTE_ROOT="${REMOTE_ROOT:-/home/amdehaqe/api.amdehaymanot.com}"

cleanup() { rm -rf "$WORK" 2>/dev/null || true; }
trap cleanup EXIT

if [[ ! -d "$DRIVE" ]]; then
  echo "External drive not mounted: $DRIVE" | tee -a "$LOG"
  exit 1
fi

mkdir -p "$WORK"
echo "" >> "$LOG"
echo "===== START $(date -Iseconds) PARALLEL=${PARALLEL} INCLUDE_HUGE=${INCLUDE_HUGE:-0} =====" | tee -a "$LOG"

# No SSH ControlMaster — it breaks parallel rsync (exit 255)
SSH_OPTS=(-p "$SSH_PORT" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -i "$SSH_KEY" -o ServerAliveInterval=20 -o ServerAliveCountMax=10 -o TCPKeepAlive=yes -o Compression=no -o BatchMode=yes)


slug() {
  echo "$1" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null | tr -cs 'A-Za-z0-9._-' '_' | sed 's/_\+/_/g;s/^_//;s/_$//' | cut -c1-60
}

# Already completed this session / earlier
SKIP_TITLES=(
  "Kidane Mihret Amtawi Keber — 16 Nehase 2016"
  "Segdet 2015"
  "2016 Files"
)

# Huge albums — skipped unless INCLUDE_HUGE=1 (overnight full run)
SKIP_FOLDERS=()
if [[ "${INCLUDE_HUGE:-0}" != "1" ]]; then
  SKIP_FOLDERS=(
    "53"
    "53ኛ"
    "SENE 21 Photo"
    "ስርዓተ ትምህርት"
    "ገና 2016"
  )
fi

is_skipped_title() {
  local t="$1"
  local x
  for x in "${SKIP_TITLES[@]}"; do
    [[ "$t" == "$x" ]] && return 0
  done
  return 1
}

is_skipped_folder() {
  local f="$1"
  local x
  for x in "${SKIP_FOLDERS[@]}"; do
    [[ "$f" == "$x" ]] && return 0
  done
  # Arts night only deferred with other huge albums
  if [[ "${INCLUDE_HUGE:-0}" != "1" ]]; then
    case "$f" in
      የኪነ\ ጥበብ*) return 0 ;;
    esac
  fi
  return 1
}

push_album() {
  local folder="$1" album="$2" category="$3"
  local prefix src

  if is_skipped_title "$album"; then
    echo "SKIP (already done): $album" | tee -a "$LOG"
    return 0
  fi
  if is_skipped_folder "$folder"; then
    echo "SKIP (huge — later): $album [$folder]" | tee -a "$LOG"
    return 0
  fi

  prefix="$(slug "$album")"
  [[ -z "$prefix" ]] && prefix="album_$(date +%s)"
  src="$DRIVE/$folder"

  echo "" | tee -a "$LOG"
  echo "==== $(date -Iseconds) :: $album ($category) :: $folder ====" | tee -a "$LOG"

  if [[ ! -d "$src" ]]; then
    echo "MISSING folder: $folder" | tee -a "$LOG"
    return 0
  fi

  rm -rf "$WORK"
  mkdir -p "$WORK"

  node - "$src" "$album" "$category" "$prefix" "$WORK/manifest.json" "$WORK/count.txt" "$WORK/files.tsv" <<'NODE' | tee -a "$LOG"
const fs = require('fs');
const path = require('path');
const [src, album, category, prefix, out, countOut, listOut] = process.argv.slice(2);
const IMAGE = new Set(['.jpg','.jpeg','.png','.webp','.tif','.tiff','.gif','.bmp','.heic','.heif']);
const VIDEO = new Set(['.mp4','.mov','.avi','.mkv','.wmv','.flv','.webm','.m4v','.3gp','.mpg','.mpeg','.ts','.mts','.vob']);
const files = [];
let skippedVideos = 0;
function walk(d, rel = '') {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(d, ent.name);
    const r = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (ent.name === '$RECYCLE.BIN') continue;
      walk(full, r);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (VIDEO.has(ext)) { skippedVideos += 1; continue; }
      if (IMAGE.has(ext)) files.push({ full, rel: r.replace(/\\/g, '/') });
    }
  }
}
walk(src);
files.sort((a, b) => a.rel.localeCompare(b.rel));
if (skippedVideos) console.log(`skipped ${skippedVideos} videos`);
if (!files.length) {
  console.log('EMPTY');
  fs.writeFileSync(out, JSON.stringify({ albums: [] }));
  fs.writeFileSync(countOut, '0');
  fs.writeFileSync(listOut, '');
  process.exit(0);
}
const images = files.map(({ rel }) => {
  const fileUrl = `/uploads/images/${prefix}/${rel}`;
  return { title: path.parse(rel).name, image_url: fileUrl, thumbnail_url: fileUrl };
});
fs.writeFileSync(out, JSON.stringify({
  createdAt: new Date().toISOString(),
  albums: [{ title: album, description: null, category, cover_image_url: images[0].image_url, images }],
}, null, 2));
fs.writeFileSync(countOut, String(images.length));
fs.writeFileSync(listOut, files.map(({ full, rel }) => `${full}\t${rel}`).join('\n') + '\n');
console.log(`READY ${images.length} images`);
NODE

  if [[ ! -f "$WORK/count.txt" ]] || [[ "$(cat "$WORK/count.txt")" == "0" ]]; then
    echo "  no images — skip" | tee -a "$LOG"
    return 0
  fi

  local count size_hint
  count="$(cat "$WORK/count.txt")"
  size_hint="$(du -sh "$src" 2>/dev/null | awk '{print $1}')"
  echo "  → rsync $count images (~$size_hint) → …/$prefix/ (resumable)" | tee -a "$LOG"

  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" \
    "mkdir -p '${REMOTE_ROOT}/uploads/images/${prefix}' '${REMOTE_ROOT}/uploads/_import'" \
    || { echo "  ssh mkdir failed — will retry on next watchdog cycle" | tee -a "$LOG"; return 1; }

  # One durable rsync per album (stable overnight; resumes with --partial)
  set +e
  attempt=1
  while true; do
    echo "  rsync attempt $attempt…" | tee -a "$LOG"
    rsync -a --partial --append-verify --timeout=300 --info=progress2 \
      --include='*/' \
      --include='*.jpg' --include='*.JPG' --include='*.jpeg' --include='*.JPEG' \
      --include='*.png' --include='*.PNG' --include='*.webp' --include='*.WEBP' \
      --include='*.gif' --include='*.GIF' --include='*.bmp' --include='*.BMP' \
      --include='*.tif' --include='*.TIF' --include='*.tiff' --include='*.TIFF' \
      --include='*.heic' --include='*.HEIC' --include='*.heif' --include='*.HEIF' \
      --exclude='*' \
      -e "ssh ${SSH_OPTS[*]}" \
      "$src/" \
      "${SSH_USER}@${SSH_HOST}:${REMOTE_ROOT}/uploads/images/${prefix}/" \
      2>&1 | tee -a "$LOG"
    ec=${PIPESTATUS[0]}
    if [[ "$ec" -eq 0 || "$ec" -eq 24 ]]; then
      break
    fi
    if [[ "$attempt" -ge 8 ]]; then
      echo "  rsync failed code $ec after $attempt attempts — album deferred to next cycle" | tee -a "$LOG"
      set -e
      return 1
    fi
    echo "  rsync interrupted ($ec) — retry in 15s…" | tee -a "$LOG"
    sleep 15
    attempt=$((attempt + 1))
  done
  set -e

  rsync -a \
    -e "ssh ${SSH_OPTS[*]}" \
    "$WORK/manifest.json" \
    "${SSH_USER}@${SSH_HOST}:${REMOTE_ROOT}/uploads/_import/manifest.json"

  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" bash -s <<EOF
set -euo pipefail
cd '${REMOTE_ROOT}'
NODE_BIN="/home/amdehaqe/nodevenv/api.amdehaymanot.com/20/bin/node"
if [[ ! -x "\$NODE_BIN" ]]; then NODE_BIN="\$(command -v node)"; fi
"\$NODE_BIN" scripts/bulkRegisterGallery.js --manifest uploads/_import/manifest.json
EOF

  echo "  ✓ on server: $album ($count images)" | tee -a "$LOG"
}

cd "$BACKEND"

push_album "16na amte ykidanmert amtawi keber bhal16-8-2016" \
  "Kidane Mihret Amtawi Keber — 16 Nehase 2016" "Feasts"

push_album "2015 ስግደት" \
  "Segdet 2015" "Spiritual Life"

push_album "2016 Files" \
  "2016 Files" "Archive"

push_album "53" \
  "53rd General Assembly" "Assemblies"

push_album "53ኛ" \
  "53ኛ ጉባኤ" "Assemblies"

push_album "SENE 21 Photo" \
  "Sene 21 Photos" "Feasts"

push_album "TEMQETE 2017 E.C" \
  "Temqete 2017 E.C." "Feasts"

push_album "Yadise ablate aqebabel" \
  "Yedise Ablate Aqebabel" "Spiritual Life"

push_album "bahta tahsas 3 2016" \
  "Bahta — Tahsas 3, 2016" "Feasts"

push_album "segedte miyazeya 25(2016)" \
  "Segdet — Miyazia 25, 2016" "Spiritual Life"

push_album "temeqte 2016" \
  "Temqete 2016" "Feasts"

push_album "tnsahe 2016" \
  "Tinsa'e 2016" "Feasts"

push_album "ሓዋርያዊ ጉዞ ወደ ዶዮ ጊዮርጊስ 2016" \
  "Apostolic Journey to Doyo Giorgis 2016" "Outreach"

push_album "መስከረም 14-2016 ዓ.ም የመስቀል በዓል ፈተና" \
  "Meskel Feast Exam — Meskerem 14, 2016" "Education"

push_album "መስከረም 15-2016 ስለ መስቀል በዓል ትምህርት" \
  "Meskel Feast Teaching — Meskerem 15, 2016" "Education"

push_album "መስከረም 21- 2016 ዓ.ም" \
  "Meskerem 21, 2016" "Events"

MEGABIT=$(find "$DRIVE" -mindepth 1 -maxdepth 1 -type d -name 'መጋቢት 8-2016*' | head -1 || true)
if [[ -n "${MEGABIT:-}" ]]; then
  push_album "$(basename "$MEGABIT")" \
    "Children's Ceremony — Megabit 8, 2016 (Hamereno Kidane Mihret)" "Events"
fi

push_album "ስርዓተ ትምህርት" \
  "Ser'ate Timihirt (Curriculum)" "Education"

push_album "በሻሻ" \
  "Be Shasha" "Events"

push_album "የ2016 ዓ.ም የ4 ወር ሪፖርት" \
  "2016 Four-Month Report" "Reports"

EXAM=$(find "$DRIVE" -mindepth 1 -maxdepth 1 -type d -name 'የ2016 የሃገር አቀፍ*' | head -1 || true)
if [[ -n "${EXAM:-}" ]]; then
  push_album "$(basename "$EXAM")" \
    "National Sunday Schools — 1st Semester Final Exam 2016" "Education"
fi

push_album "የ2018 ተቅላላ ጉባኤ" \
  "2018 General Assembly" "Assemblies"

push_album "የሀገረ ስብከቱ የተተኪ መምህር ምርቃት" \
  "Substitute Teachers Ordination — Diocese" "Leadership"

push_album "የህቅድ ግምገማ መስከረም 15-2016" \
  "Plan Review — Meskerem 15, 2016" "Reports"

push_album "የላብረሪ ምርቃት" \
  "Library Dedication" "Library"

push_album "የሥራ አመራር ሽኝት ጱግሜ 5-2015 ዓ.ም" \
  "Leadership Handover — Pagumen 5, 2015" "Leadership"

ARTS=$(find "$DRIVE" -mindepth 1 -maxdepth 1 -type d -name 'የኪነ ጥበብ ምሽት*' | head -1 || true)
if [[ -n "${ARTS:-}" ]]; then
  push_album "$(basename "$ARTS")" \
    "Arts Night — 17 Nehase 2016" "Culture"
fi

push_album "የጥምቀት ጥናት 2016" \
  "Timket Study 2016" "Education"

push_album "ገና 2016" \
  "Christmas (Gena) 2016" "Feasts"

echo "" | tee -a "$LOG"
echo "==== ALL DONE $(date -Iseconds) INCLUDE_HUGE=${INCLUDE_HUGE:-0} ====" | tee -a "$LOG"
if [[ "${INCLUDE_HUGE:-0}" != "1" ]]; then
  echo "Deferred for later: 53, 53ኛ, SENE 21, Curriculum, Arts Night, Gena" | tee -a "$LOG"
fi
