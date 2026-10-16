// @vitest-environment node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { excerpt, normaliseDate, parseExifDate, readCollection } from './build-photos.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'build-photos-'));
afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

describe('helpers', () => {
  it('parses EXIF dates', () => {
    expect(parseExifDate('2025:08:13 14:30:00')).toBe('2025-08-13T14:30:00');
    expect(parseExifDate('garbage')).toBeNull();
    expect(parseExifDate(undefined)).toBeNull();
  });

  it('normalises frontmatter dates of any precision', () => {
    expect(normaliseDate('2025')).toBe('2025');
    expect(normaliseDate('2025-10')).toBe('2025-10');
    expect(normaliseDate(new Date('2025-08-12T00:00:00Z'))).toBe('2025-08-12');
    expect(normaliseDate('August 2025')).toBeNull();
  });

  it('takes the first real paragraph as excerpt', () => {
    expect(excerpt('<!-- note -->\n\n## Heading\n\nFirst *para*.\n\nSecond.')).toBe('First para.');
    expect(excerpt('word '.repeat(100), 20).endsWith('…')).toBe(true);
  });
});

describe('readCollection', () => {
  it('merges frontmatter with the images in the folder', async () => {
    const dir = path.join(tmp, 'test-trip');
    fs.mkdirSync(dir);
    await sharp({ create: { width: 8, height: 8, channels: 3, background: '#888' } }).png().toFile(path.join(dir, 'b.png'));
    await sharp({ create: { width: 8, height: 8, channels: 3, background: '#444' } }).jpeg().toFile(path.join(dir, 'a.jpg'));
    fs.writeFileSync(path.join(dir, 'notes.txt'), 'ignored');
    fs.writeFileSync(
      path.join(dir, 'trip.md'),
      ['---', 'title: Test', 'start: 2025-08-12', 'draft: true', 'photos:', '  b.png: { caption: Hi, featured: true }', '---', '', 'Story **here**.'].join('\n'),
    );

    const col = readCollection(dir, 'trip.md');
    expect(col).toMatchObject({ id: 'test-trip', title: 'Test', start: '2025-08-12', draft: true, excerpt: 'Story here.' });
    expect(col.bodyHtml).toContain('<strong>here</strong>');
    expect(col.files).toEqual([{ file: 'a.jpg' }, { file: 'b.png', caption: 'Hi', featured: true }]);
  });
});
