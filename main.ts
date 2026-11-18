// Entry program for make.fun's news-image-20261117 bounty (Node 22, standard
// library only). The entry is a single image, entry.png beside this file, that
// sums up the world's news of Tuesday 17 November 2026. This program validates
// that image against the competition's caps (a PNG of at most 1 MiB and at most
// 1024 by 1024 pixels) and copies it to /output/entry.png, which is all the
// grader reads.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1024 * 1024;
const MAX_SIDE = 1024;
// PNG signature: 89 50 4E 47 0D 0A 1A 0A
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(message) {
  console.error(`entry.png rejected: ${message}`);
  process.exit(1);
}

const src = new URL('./entry.png', import.meta.url);
const data = readFileSync(src);

if (data.length < 8 || !data.subarray(0, 8).equals(PNG_SIGNATURE)) {
  fail('not a PNG file');
}
if (data.length > MAX_BYTES) {
  fail(`too large: ${data.length} bytes (max ${MAX_BYTES})`);
}
// IHDR chunk: length (4 bytes) + type "IHDR" (4 bytes), then width and height
// as big-endian uint32 at offsets 16 and 20.
if (data.length < 24 || data.toString('ascii', 12, 16) !== 'IHDR') {
  fail('missing IHDR chunk');
}
const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (width > MAX_SIDE || height > MAX_SIDE) {
  fail(`too big: ${width}x${height} pixels (max ${MAX_SIDE}x${MAX_SIDE})`);
}

console.log(`entry.png: ${width}x${height}, ${data.length} bytes — OK`);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
copyFileSync(src, join(outDir, 'entry.png'));
