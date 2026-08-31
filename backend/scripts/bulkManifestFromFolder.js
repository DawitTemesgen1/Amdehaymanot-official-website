#!/usr/bin/env node
/**
 * Build a gallery manifest from original image files (no recompression).
 * Videos are ignored. thumbnail_url === image_url (same file).
 *
 *   node scripts/bulkManifestFromFolder.js \
 *     --source "/path/to/photos" \
 *     --album "Title" \
 *     --category "Feasts" \
 *     --remote-prefix "53rd_General_Assembly" \
 *     --out /tmp/manifest.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IMAGE_EXT = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.gif', '.bmp', '.heic', '.heif',
]);
const VIDEO_EXT = new Set([
  '.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.mpg', '.mpeg', '.ts', '.mts', '.vob',
]);

function parseArgs(argv) {
  const args = {
    source: null,
    album: null,
    category: 'Gallery',
    remotePrefix: null,
    out: null,
    listOut: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === '--source') { args.source = next; i += 1; }
    else if (a === '--album') { args.album = next; i += 1; }
    else if (a === '--category') { args.category = next; i += 1; }
    else if (a === '--remote-prefix') { args.remotePrefix = next; i += 1; }
    else if (a === '--out') { args.out = next; i += 1; }
    else if (a === '--list-out') { args.listOut = next; i += 1; }
  }
  return args;
}

function slugPart(name) {
  return String(name)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'album';
}

function listImages(dir) {
  const out = [];
  let skippedVideos = 0;
  const walk = (d) => {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.name.startsWith('.')) continue;
      if (ent.isDirectory()) {
        if (ent.name === '$RECYCLE.BIN' || ent.name === 'System Volume Information') continue;
        walk(full);
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (VIDEO_EXT.has(ext)) {
          skippedVideos += 1;
          continue;
        }
        if (IMAGE_EXT.has(ext)) out.push(full);
      }
    }
  };
  walk(dir);
  out.sort((a, b) => a.localeCompare(b));
  return { files: out, skippedVideos };
}

function safeRemoteName(filePath, index, prefix) {
  const ext = path.extname(filePath).toLowerCase() || '.jpg';
  const base = path.parse(filePath).name
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 40) || 'img';
  const tag = crypto.randomBytes(2).toString('hex');
  return `${prefix}/${String(index + 1).padStart(4, '0')}-${base}-${tag}${ext}`;
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.source || !args.album || !args.out || !args.listOut) {
    console.error('Need --source --album --out --list-out [--category] [--remote-prefix]');
    process.exit(1);
  }
  if (!fs.existsSync(args.source)) {
    console.error(`Source not found: ${args.source}`);
    process.exit(1);
  }

  const prefix = args.remotePrefix || slugPart(args.album);
  const { files, skippedVideos } = listImages(args.source);
  if (skippedVideos) console.log(`skipped ${skippedVideos} videos`);
  if (files.length === 0) {
    console.log('EMPTY');
    fs.writeFileSync(args.out, JSON.stringify({ createdAt: new Date().toISOString(), albums: [] }, null, 2));
    fs.writeFileSync(args.listOut, '');
    process.exit(0);
  }

  const images = [];
  const listLines = [];
  files.forEach((filePath, i) => {
    const remoteRel = safeRemoteName(filePath, i, prefix);
    const publicPath = `/uploads/images/${remoteRel}`;
    images.push({
      title: path.parse(filePath).name,
      image_url: publicPath,
      thumbnail_url: publicPath,
    });
    // rsync --files-from style: absolute source + we map via a pairs file
    listLines.push(`${filePath}\t${remoteRel}`);
  });

  const manifest = {
    createdAt: new Date().toISOString(),
    albums: [{
      title: args.album,
      description: null,
      category: args.category,
      cover_image_url: images[0].image_url,
      images,
    }],
  };

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(args.listOut, `${listLines.join('\n')}\n`);
  console.log(`READY ${files.length} images → prefix ${prefix}`);
}

main();
