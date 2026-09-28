// Turns the Codex-generated PNGs in /art into web-ready WebP files in /public/art.
// The paper background is flood-filled from the image edges into transparency, so
// illustrations sit directly on the page without a visible box.
//   node scripts/process-art.mjs
import sharp from "sharp";

const JOBS = [
  // name, output width, crop (fraction kept, centered), cutout background?
  ["hero", 1400, 1, true],
  ["home", 1000, 1, false],
  ["oximeter", 900, 0.8, false],
  ["step-book", 420, 0.5, true],
  ["step-chat", 420, 0.5, true],
  ["step-care", 420, 0.5, true],
  ["done", 420, 0.5, true],
  ["mascot", 360, 0.5, true],
  ["flowers", 520, [0.6, 0.45], true],
];

const NEAR = 18; // colour distance treated as fully background
const FAR = 46; // beyond this, fully opaque

function cutout(data, w, h) {
  const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
  // Background reference: average of the four corners.
  const corners = [0, w - 1, (h - 1) * w, h * w - 1].map(px);
  const bg = [0, 1, 2].map((c) => corners.reduce((s, p) => s + p[c], 0) / 4);
  const dist = (i) => Math.hypot(data[i * 4] - bg[0], data[i * 4 + 1] - bg[1], data[i * 4 + 2] - bg[2]);

  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (seen[i]) continue;
    seen[i] = 1;
    const d = dist(i);
    if (d >= FAR) continue;
    data[i * 4 + 3] = d <= NEAR ? 0 : Math.round((255 * (d - NEAR)) / (FAR - NEAR));
    const x = i % w, y = (i - x) / w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }
}

for (const [name, width, crop, transparent] of JOBS) {
  let img = sharp(`art/${name}.png`);
  const { width: W, height: H } = await img.metadata();
  const [fx, fy] = Array.isArray(crop) ? crop : [crop, crop];
  const cw = Math.round(W * fx), ch = Math.round(H * fy);
  if (fx < 1 || fy < 1) img = img.extract({ left: Math.round((W - cw) / 2), top: Math.round((H - ch) / 2), width: cw, height: ch });
  img = img.resize({ width });

  if (transparent) {
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    cutout(data, info.width, info.height);
    img = sharp(data, { raw: info });
  }
  const out = await img.webp({ quality: 82, alphaQuality: 90 }).toFile(`public/art/${name}.webp`);
  console.log(name, `${out.width}x${out.height}`, `${Math.round(out.size / 1024)}KB`);
}
