#!/usr/bin/env node
/**
 * Register albums/images from a bulkPrepareGallery manifest into MySQL.
 * Run on the server (or anywhere with DB access + files already under uploads/images).
 *
 *   node scripts/bulkRegisterGallery.js --manifest ./gallery-staging/manifest.json
 *   node scripts/bulkRegisterGallery.js --manifest /home/.../uploads/_import/manifest.json
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function parseArgs(argv) {
  const args = { manifest: null, dryRun: false };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--manifest') { args.manifest = argv[++i]; }
    else if (argv[i] === '--dry-run') { args.dryRun = true; }
  }
  return args;
}

async function ensureCategory(conn, name) {
  const [rows] = await conn.query('SELECT id FROM gallery_categories WHERE name = ? LIMIT 1', [name]);
  if (rows.length) return rows[0].id;
  const [result] = await conn.query('INSERT INTO gallery_categories SET ?', { name });
  return result.insertId;
}

async function findAlbumByTitle(conn, title) {
  const [rows] = await conn.query('SELECT id FROM albums WHERE title = ? LIMIT 1', [title]);
  return rows[0]?.id || null;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.manifest) {
    console.error('Usage: node scripts/bulkRegisterGallery.js --manifest ./manifest.json');
    process.exit(1);
  }
  const abs = path.resolve(args.manifest);
  if (!fs.existsSync(abs)) {
    console.error(`Manifest not found: ${abs}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(abs, 'utf8'));
  if (!Array.isArray(manifest.albums) || manifest.albums.length === 0) {
    console.error('Manifest has no albums.');
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: false,
  });

  console.log(`Registering ${manifest.albums.length} albums (dryRun=${args.dryRun})…`);

  try {
    for (const album of manifest.albums) {
      const categoryId = await ensureCategory(conn, album.category || 'Gallery');
      let albumId = await findAlbumByTitle(conn, album.title);

      if (!albumId) {
        if (args.dryRun) {
          console.log(`[dry-run] create album ${album.title} (${album.images.length} images)`);
          continue;
        }
        const [result] = await conn.query('INSERT INTO albums SET ?', {
          title: album.title,
          description: album.description || null,
          categoryId,
          cover_image_url: album.cover_image_url || null,
        });
        albumId = result.insertId;
        console.log(`Created album #${albumId}: ${album.title}`);
      } else {
        console.log(`Album exists #${albumId}: ${album.title} — appending new images`);
        if (!args.dryRun && album.cover_image_url) {
          await conn.query('UPDATE albums SET cover_image_url = COALESCE(cover_image_url, ?), categoryId = ? WHERE id = ?', [
            album.cover_image_url,
            categoryId,
            albumId,
          ]);
        }
      }

      if (args.dryRun) continue;

      const [existing] = await conn.query(
        'SELECT image_url FROM album_images WHERE albumId = ?',
        [albumId],
      );
      const have = new Set(existing.map((r) => r.image_url));
      const rows = album.images
        .filter((img) => !have.has(img.image_url))
        .map((img) => [albumId, img.title || 'Untitled', img.image_url, img.thumbnail_url]);

      if (rows.length === 0) {
        console.log(`  no new images`);
        continue;
      }

      const chunk = 200;
      for (let i = 0; i < rows.length; i += chunk) {
        await conn.query(
          'INSERT INTO album_images (albumId, title, image_url, thumbnail_url) VALUES ?',
          [rows.slice(i, i + chunk)],
        );
      }
      console.log(`  inserted ${rows.length} images`);
    }
  } finally {
    await conn.end();
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
