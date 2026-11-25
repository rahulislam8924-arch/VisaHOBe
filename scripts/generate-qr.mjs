/**
 * Generates the app-download QR code and raster favicons that ship with the site.
 * Run with: node scripts/generate-qr.mjs
 */
import QRCode from 'qrcode';
import { mkdir, readFile } from 'node:fs/promises';

const TARGET = 'https://visahobe.com/download';
const OUT = 'public/visahobe-app-qr.png';

await mkdir('public', { recursive: true });
await QRCode.toFile(OUT, TARGET, {
  errorCorrectionLevel: 'M',
  margin: 1,
  width: 640,
  color: { dark: '#202124', light: '#ffffff' },
});
console.log(`Wrote ${OUT} -> ${TARGET}`);

// Rasterise the favicon for browsers/iOS that do not support SVG icons
import sharp from 'sharp';
const svgIcon = await readFile('public/favicon.svg');
for (const [size, name] of [[180, 'apple-touch-icon.png'], [32, 'favicon-32.png'], [192, 'icon-192.png']]) {
  await sharp(svgIcon, { density: 384 }).resize(size, size).png().toFile(`public/${name}`);
  console.log(`Wrote public/${name} (${size}x${size})`);
}
