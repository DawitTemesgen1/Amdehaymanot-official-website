# Amde Haymanot — Intro & Outro Videos

Logo animation videos built with [Remotion](https://www.remotion.dev/) using the official Amde Haymanot brand colors and logo.

## Preview in browser

```bash
cd video
npm install
npm run studio
```

## Render MP4 files

Requires FFmpeg on your system.

```bash
cd video
npm install
npm run render:all
```

Output:
- `video/out/amdehaymanot-intro.mp4` — 5s intro (1920×1080)
- `video/out/amdehaymanot-outro.mp4` — 5s outro (1920×1080)

## Animation sequence

1. **Brand bars** wipe in from center (top & bottom)
2. **Logo line-draw** — simplified church emblem strokes draw on (frame, domes, cross, book, drums, gold arc)
3. **Full logo reveal** — detailed PNG fades in over the drawing
4. **Text** slides up with animated gold underline
5. **Fade out** (outro)

## Compositions

| ID | Description |
|----|-------------|
| `Intro` | Logo reveal with gold glow, title, Amharic name, tagline |
| `Outro` | Logo with website URL and cathedral name, fade out |

## Brand

Colors from `src/brand.js`: navy `#004179`, gold `#FFCF00`.

Logo: `public/logo.png` (from `src/assets/logo-clear.png`).
