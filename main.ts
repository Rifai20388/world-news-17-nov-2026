// Entry program for make.fun's news-image-20261117 bounty (Node 22, standard
// library only). The entry is a single image, entry.png beside this file, that
// sums up the world's news of Tuesday 17 November 2026. This program copies
// that image to /output/entry.png, which is all the grader reads.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
copyFileSync(new URL('./entry.png', import.meta.url), join(outDir, 'entry.png'));
