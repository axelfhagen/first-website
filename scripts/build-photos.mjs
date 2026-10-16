#!/usr/bin/env node
/**
 * Builds everything the site needs from `content/`:
 *
 *   content/trips/<id>/trip.md     frontmatter + story, photos next to it
 *   content/gallery/gallery.md     loose photos (not tied to a trip)
 *   content/portrait.jpg           the portrait on the home page (+ og:image)
 *
 * Outputs
 *   public/img/<collection>/<name>-<width>.webp   resized, auto-oriented
 *   src/data/photos.generated.json                trips + photos manifest
 *
 * Image work is cached in public/img/.cache.json (keyed by size + mtime),
 * so re-runs only touch new or changed photos.
 *
 * Run: npm run photos
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUT_IMG_DIR = path.join(ROOT, 'public', 'img');
const OUT_JSON = path.join(ROOT, 'src', 'data', 'photos.generated.json');
const CACHE_FILE = path.join(OUT_IMG_DIR, '.cache.json');

export const WIDTHS = [480, 720, 960, 1600, 2048];
const WEBP_QUALITY = 78;
const IMAGE_EXT = /\.(png|jpe?g|webp|heic|tiff?)$/i;

/** "2025:08:13 14:30:00" -> "2025-08-13T14:30:00" */
export function parseExifDate(value) {
  if (!value || typeof value !== 'string') return null;
  const m = value.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}` : null;
}

/** Frontmatter dates may be YAML dates, "2025", "2025-10" or "2025-10-03". Normalise to strings. */
export function normaliseDate(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const s = String(value).trim();
  return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s) ? s : null;
}

/** First paragraph of a markdown body as plain text, trimmed to ~`max` characters. */
export function excerpt(markdown, max = 180) {
  const para = markdown
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith('#') && !p.startsWith('-'));
  if (!para) return '';
  const text = para.replace(/[*_`>#[\]]/g, '').replace(/\(([^)]+)\)/g, '($1)').replace(/\s+/g, ' ');
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)).replace(/[,.;:]$/, '') + '…';
}

export function renderMarkdown(markdown) {
  const clean = markdown.replace(/<!--[\s\S]*?-->/g, '').trim();
  return clean ? marked.parse(clean, { async: false }) : '';
}

/**
 * Reads one collection folder (a trip or the gallery) into a plain description,
 * without touching any images. Exported for tests.
 */
export function readCollection(dir, indexFile) {
  const id = path.basename(dir);
  const indexPath = path.join(dir, indexFile);
  const { data, content } = fs.existsSync(indexPath)
    ? matter(fs.readFileSync(indexPath, 'utf8'))
    : { data: {}, content: '' };

  const files = fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  const photoMeta = data.photos ?? {};
  for (const name of Object.keys(photoMeta)) {
    if (!files.includes(name)) console.warn(`  ! ${id}: frontmatter mentions "${name}" but the file is missing`);
  }

  return {
    id,
    title: data.title ?? id,
    title_no: data.title_no ?? null,
    location: data.location ?? null,
    start: normaliseDate(data.start),
    end: normaliseDate(data.end),
    cover: data.cover ?? null,
    draft: data.draft === true,
    bodyHtml: renderMarkdown(content),
    excerpt: excerpt(content),
    files: files.map((file) => ({ file, ...(photoMeta[file] ?? {}) })),
  };
}

function slug(file) {
  return file.replace(IMAGE_EXT, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function readExifDate(buffer) {
  try {
    const { default: ExifReader } = await import('exifreader');
    const tags = ExifReader.load(buffer);
    return parseExifDate(tags.DateTimeOriginal?.description ?? tags.DateTime?.description);
  } catch {
    return null;
  }
}

/** Resizes one photo (if needed) and returns its manifest entry data. */
async function processImage(sharp, srcPath, collectionId, cache) {
  const stat = fs.statSync(srcPath);
  const name = slug(path.basename(srcPath));
  const outDir = path.join(OUT_IMG_DIR, collectionId);
  const key = `${collectionId}/${path.basename(srcPath)}`;
  const fingerprint = `${stat.size}:${Math.round(stat.mtimeMs)}:${WIDTHS.join(",")}:${WEBP_QUALITY}`;
  const cached = cache[key];

  const outputsExist = (widths) => widths.every((w) => fs.existsSync(path.join(outDir, `${name}-${w}.webp`)));
  if (cached?.fingerprint === fingerprint && outputsExist(cached.widths)) {
    return { ...cached, name, reused: true };
  }

  const buffer = fs.readFileSync(srcPath);
  const meta = await sharp(buffer).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  // Never upscale: keep the widths smaller than the original, plus the original width if it's below the max.
  const widths = WIDTHS.filter((w) => w < width);
  if (width <= WIDTHS.at(-1)) widths.push(width);

  fs.mkdirSync(outDir, { recursive: true });
  const base = sharp(buffer, { limitInputPixels: false }).rotate();
  await Promise.all(
    widths.map((w) =>
      base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 5 })
        .toFile(path.join(outDir, `${name}-${w}.webp`)),
    ),
  );

  const tiny = await base.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  const blur = `data:image/webp;base64,${tiny.toString('base64')}`;
  const date = (await readExifDate(buffer)) ?? new Date(stat.mtimeMs).toISOString().slice(0, 19);

  const entry = { fingerprint, width, height, widths, blur, date };
  cache[key] = entry;
  return { ...entry, name, reused: false };
}

/** Square portrait at a few small widths, plus a JPEG for social previews. */
async function buildPortrait(sharp, produced) {
  const src = path.join(CONTENT_DIR, 'portrait.jpg');
  if (!fs.existsSync(src)) return null;
  const outDir = path.join(OUT_IMG_DIR, 'site');
  fs.mkdirSync(outDir, { recursive: true });
  const widths = [320, 640, 960];
  const srcMtime = fs.statSync(src).mtimeMs;
  const stale = (file) => !fs.existsSync(file) || fs.statSync(file).mtimeMs < srcMtime;
  const base = sharp(src).rotate();

  for (const w of widths) {
    const out = path.join(outDir, `portrait-${w}.webp`);
    if (stale(out)) await base.clone().resize({ width: w }).webp({ quality: 80 }).toFile(out);
    produced.add(path.join('site', `portrait-${w}.webp`));
  }
  const og = path.join(outDir, 'og.jpg');
  if (stale(og)) await base.clone().resize({ width: 1200, height: 1200, fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
  produced.add(path.join('site', 'og.jpg'));

  const { width, height } = await sharp(path.join(outDir, `portrait-${widths.at(-1)}.webp`)).metadata();
  const tiny = await base.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  return {
    id: 'site/portrait',
    src: '/img/site/portrait',
    widths,
    width,
    height,
    blur: `data:image/webp;base64,${tiny.toString('base64')}`,
  };
}

/** Removes generated files (and cache entries) whose source photo is gone or whose widths changed. */
function pruneOutputs(produced, cache) {
  for (const dir of fs.readdirSync(OUT_IMG_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const abs = path.join(OUT_IMG_DIR, dir.name);
    for (const file of fs.readdirSync(abs)) {
      if (/\.(webp|jpg)$/.test(file) && !produced.has(path.join(dir.name, file))) fs.rmSync(path.join(abs, file));
    }
    if (fs.readdirSync(abs).length === 0) fs.rmdirSync(abs);
  }
  const live = new Set([...produced].map((p) => p.split(path.sep)[0]));
  for (const key of Object.keys(cache)) {
    if (!live.has(key.split('/')[0])) delete cache[key];
  }
}

export async function build() {
  const { default: sharp } = await import('sharp');
  const cache = loadCache();

  const tripsDir = path.join(CONTENT_DIR, 'trips');
  const collections = [
    ...fs
      .readdirSync(tripsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .map((d) => ({ ...readCollection(path.join(tripsDir, d.name), 'trip.md'), kind: 'trip', dir: path.join(tripsDir, d.name) })),
    { ...readCollection(path.join(CONTENT_DIR, 'gallery'), 'gallery.md'), kind: 'gallery', dir: path.join(CONTENT_DIR, 'gallery') },
  ];

  const photos = [];
  const trips = [];
  const produced = new Set();
  let processed = 0;

  for (const col of collections) {
    const photoIds = [];
    for (const item of col.files) {
      const img = await processImage(sharp, path.join(col.dir, item.file), col.id, cache);
      if (!img.reused) {
        processed++;
        console.log(`  ✓ ${col.id}/${item.file}  ${img.width}×${img.height}`);
      }
      const id = `${col.id}/${img.name}`;
      photoIds.push(id);
      for (const w of img.widths) produced.add(path.join(col.id, `${img.name}-${w}.webp`));
      photos.push({
        id,
        file: item.file,
        src: `/img/${col.id}/${img.name}`,
        widths: img.widths,
        width: img.width,
        height: img.height,
        blur: img.blur,
        date: item.date ? String(item.date) : img.date,
        alt: item.alt ?? item.caption ?? null,
        caption: item.caption ?? null,
        location: item.location ?? (col.kind === 'trip' ? col.location : null),
        featured: item.featured === true,
        tripId: col.kind === 'trip' ? col.id : null,
        draft: col.draft,
      });
    }

    if (col.kind === 'trip') {
      const coverId = col.cover ? `${col.id}/${slug(col.cover)}` : photoIds[0] ?? null;
      trips.push({
        id: col.id,
        title: col.title,
        title_no: col.title_no,
        location: col.location,
        start: col.start,
        end: col.end,
        draft: col.draft,
        cover: photoIds.includes(coverId) ? coverId : photoIds[0] ?? null,
        excerpt: col.excerpt,
        bodyHtml: col.bodyHtml,
        photoIds,
      });
    }
  }

  // Newest trip first; undated trips last.
  trips.sort((a, b) => (b.start ?? '').localeCompare(a.start ?? ''));

  const portrait = await buildPortrait(sharp, produced);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify({ portrait, trips, photos }, null, 2) + '\n');
  pruneOutputs(produced, cache);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));

  const published = trips.filter((t) => !t.draft).length;
  console.log(
    `photos: ${photos.length} photos (${processed} processed, ${photos.length - processed} cached), ` +
      `${trips.length} trips (${published} published, ${trips.length - published} drafts)`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
