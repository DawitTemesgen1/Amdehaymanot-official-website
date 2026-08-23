#!/usr/bin/env node
/**
 * Compress local album folders into webp + thumbs for fast rsync to the server.
 *
 * Usage (single album):
 *   node scripts/bulkPrepareGallery.js \
 *     --source "/path/to/photos" \
 *     --album "Sene 21 2016" \
 *     --category "Events" \
 *     --out ./gallery-staging
 *
 * Usage (each subdirectory = album):
 *   node scripts/bulkPrepareGallery.js \
 *     --source "/path/to/parent" \
 *     --parent \
 *     --category "Events" \
 *     --out ./gallery-staging
 *
 * Options:
 *   --limit N     Only process N images per album (smoke test)
 *   --concurrency N  Parallel sharp jobs (default 2)
 *   --quality N   WebP quality 1-100 (default 80)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.gif', '.bmp']);

function parseArgs(argv) {
  const args = {
    source: null,
    album: null,
    category: 'Gallery',
    out: path.resolve(process.cwd(), 'gallery-staging'),
    parent: false,
    limit: 0,
    concurrency: 2,
    quality: 80,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === '--source') { args.source = next; i += 1; }
    else if (a === '--album') { args.album = next; i += 1; }
    else if (a === '--category') { args.category = next; i += 1; }
    else if (a === '--out') { args.out = path.resolve(next); i += 1; }
    else if (a === '--parent') { args.parent = true; }
    else if (a === '--limit') { args.limit = parseInt(next, 10) || 0; i += 1; }
    else if (a === '--concurrency') { args.concurrency = Math.max(1, parseInt(next, 10) || 2); i += 1; }
    else if (a === '--quality') { args.quality = Math.min(100, Math.max(40, parseInt(next, 10) || 80)); i += 1; }
    else if (a === '--help' || a === '-h') { args.help = true; }
  }
  return args;
}

function slugPart(name) {
  return String(name)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 60) || 'img';
}

function listImages(dir) {
  const out = [];
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
      if (ent.isDirectory()) walk(full);
      else if (ent.isFile() && IMAGE_EXT.has(path.extname(ent.name).toLowerCase())) {
        out.push(full);
      }
    }
  };
  walk(dir);
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let idx = 0;
  const runners = Array.from({ length: concurrency }, async () => {
    while (idx < items.length) {
      const i = idx;
      idx += 1;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

async function processAlbum({ sourceDir, albumTitle, category, outRoot, limit, concurrency, quality }) {
  const imagesDir = path.join(outRoot, 'images');
  fs.mkdirSync(imagesDir, { recursive: true });

  let files = listImages(sourceDir);
  if (limit > 0) files = files.slice(0, limit);
  if (files.length === 0) {
    console.warn(`  skip empty: ${albumTitle}`);
    return null;
  }

  console.log(`\nAlbum: ${albumTitle} (${files.length} images)`);
  const albumSlug = slugPart(albumTitle);
  const stamp = Date.now();
  const images = [];

  await mapPool(files, concurrency, async (filePath, i) => {
    const base = `${stamp}-${albumSlug}-${String(i + 1).padStart(4, '0')}-${crypto.randomBytes(2).toString('hex')}`;
    const fullName = `${base}.webp`;
    const thumbName = `${base}-thumb.webp`;
    const fullPath = path.join(imagesDir, fullName);
    const thumbPath = path.join(imagesDir, thumbName);
    const title = path.parse(filePath).name;

    try {
      const pipeline = sharp(filePath, { failOn: 'none', sequentialRead: true }).rotate();
      await pipeline
        .clone()
        .resize({ width: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality })
        .toFile(fullPath);
      await pipeline
        .clone()
        .resize({ width: 400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: Math.min(quality, 70) })
        .toFile(thumbPath);

      images.push({
        title,
        image_url: `/uploads/images/${fullName}`,
        thumbnail_url: `/uploads/images/${thumbName}`,
        source: filePath,
      });
      if ((i + 1) % 25 === 0 || i + 1 === files.length) {
        process.stdout.write(`  processed ${i + 1}/${files.length}\r`);
      }
    } catch (err) {
      console.error(`\n  FAIL ${filePath}: ${err.message}`);
    }
  });

  process.stdout.write('\n');
  if (images.length === 0) return null;

  const cover = images[0];
  return {
    title: albumTitle,
    description: null,
    category,
    cover_image_url: cover.image_url,
    images,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.source) {
    console.log(`See header comment in ${__filename}`);
    process.exit(args.help ? 0 : 1);
  }
  if (!args.parent && !args.album) {
    console.error('Provide --album TITLE or --parent (subdir = album).');
    process.exit(1);
  }
  if (!fs.existsSync(args.source)) {
    console.error(`Source not found: ${args.source}`);
    process.exit(1);
  }

  fs.mkdirSync(path.join(args.out, 'images'), { recursive: true });

  const albums = [];
  if (args.parent) {
    const entries = fs.readdirSync(args.source, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== '$RECYCLE.BIN');
    for (const ent of entries) {
      const album = await processAlbum({
        sourceDir: path.join(args.source, ent.name),
        albumTitle: ent.name,
        category: args.category,
        outRoot: args.out,
        limit: args.limit,
        concurrency: args.concurrency,
        quality: args.quality,
      });
      if (album) albums.push(album);
    }
  } else {
    const album = await processAlbum({
      sourceDir: args.source,
      albumTitle: args.album,
      category: args.category,
      outRoot: args.out,
      limit: args.limit,
      concurrency: args.concurrency,
      quality: args.quality,
    });
    if (album) albums.push(album);
  }

  const manifestPath = path.join(args.out, 'manifest.json');
  const manifest = {
    createdAt: new Date().toISOString(),
    albums,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const imageCount = albums.reduce((n, a) => n + a.images.length, 0);
  console.log(`\nDone. ${albums.length} albums, ${imageCount} images → ${args.out}`);
  console.log(`Manifest: ${manifestPath}`);
  console.log('Next: ./scripts/push-gallery-rsync.sh', args.out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
