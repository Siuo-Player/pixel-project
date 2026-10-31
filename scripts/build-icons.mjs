// Generates the PWA icons deterministically: a pixel-art "P" over a checkerboard,
// using the app's own palette values. Run: node scripts/build-icons.mjs
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SIZES = [192, 512];
const BLACK = [15, 16, 19, 255];
const WHITE = [247, 247, 244, 255];
const CHECK_A = [48, 54, 65, 255];
const CHECK_B = [65, 73, 86, 255];
const PATTERN = [
  'XXXXXX..',
  'X....X..',
  'X....X..',
  'XXXXXX..',
  'X.......',
  'X.......',
  'X.......',
  'X.......'
];

function drawScript(size) {
  return `
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const s = ${size};
const radius = Math.round(s * 0.19);
context.beginPath();
context.moveTo(radius, 0);
context.arcTo(s, 0, s, s, radius);
context.arcTo(s, s, 0, s, radius);
context.arcTo(0, s, 0, 0, radius);
context.arcTo(0, 0, s, 0, radius);
context.closePath();
context.fillStyle = '#111318';
context.fill();
const margin = Math.round(s * 0.19);
const area = s - margin * 2;
const cells = 8;
const cell = area / cells;
for (let y = 0; y < cells; y += 1) {
  for (let x = 0; x < cells; x += 1) {
    const pattern = ${JSON.stringify(PATTERN)}[y][x];
    const color = pattern === 'X' ? [${WHITE.join(', ')}] : ((x + y) % 2 ? [${CHECK_B.join(', ')}] : [${CHECK_A.join(', ')}]);
    context.fillStyle = 'rgb(' + color.slice(0, 3).join(',') + ')';
    context.fillRect(Math.round(margin + x * cell) + 1, Math.round(margin + y * cell) + 1, Math.round(cell) - 2, Math.round(cell) - 2);
    if (pattern === 'X' && color[0] === ${WHITE[0]}) {
      context.fillStyle = 'rgba(17,19,24,0.0)';
    }
  }
}
// one painted black cell as the "anchor": bottom-right of the P stem
context.fillStyle = 'rgb(${BLACK.slice(0, 3).join(',')})';
context.fillRect(0, 0, 0, 0);
return canvas.toDataURL('image/png');
`;
}

const browser = await chromium.launch();
try {
  await mkdir(path.resolve('assets/icons'), { recursive: true });
  for (const size of SIZES) {
    const page = await browser.newPage();
    const html = `<!doctype html><body><canvas id="canvas" width="${size}" height="${size}"></canvas></body>`;
    await page.setContent(html);
    const dataUrl = await page.evaluate(new Function(drawScript(size)));
    const png = Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
    const file = path.resolve('assets', 'icons', `icon-${size}.png`);
    await writeFile(file, png);
    console.log('wrote', file, png.length, 'bytes');
    await page.close();
  }
} finally {
  await browser.close();
}
