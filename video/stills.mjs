// Renders preview stills of key frames: node stills.mjs 120 240 ...   (half resolution)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const frames = process.argv.slice(2).map(Number);
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'Presentation' });
for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.jpg`);
  await renderStill({ composition, serveUrl, output, frame, scale: 0.5, imageFormat: 'jpeg', jpegQuality: 85 });
  console.log('still', frame);
}
