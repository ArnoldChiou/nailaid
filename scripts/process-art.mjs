// Turns the Codex-generated PNGs in /art into responsive AVIF + WebP files in /public/art,
// and writes src/lib/art.json (dimensions, widths, tiny blurred placeholder) for <Art>.
// The paper background is flood-filled from the image edges into transparency, so
// illustrations sit directly on the page without a visible box.
//   node scripts/process-art.mjs
import fs from "node:fs";
import sharp from "sharp";

const JOBS = [
  // name, output widths, crop (fraction kept, centered), cutout background?, source file (defaults to name)
  ["hero-brand", [480, 800, 1200], 1, true, "hero-brand-v2"],
  ["hero", [480, 800, 1200], 1, true],
  ["home", [480, 800], 1, false],
  ["oximeter", [320, 640], 0.8, false],
  ["step-book", [160, 320], 0.5, true],
  ["step-chat", [160, 320], 0.5, true],
  ["step-care", [160, 320], 0.5, true],
  ["done", [160, 320], 0.5, true],
  ["mascot", [80, 160, 320], 0.5, true],
  ["flowers", [260, 520], [0.6, 0.45], true],
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

fs.rmSync("public/art", { recursive: true, force: true });
fs.mkdirSync("public/art", { recursive: true });
const manifest = {};
let total = 0;

for (const [name, widths, crop, transparent, source = name] of JOBS) {
  let img = sharp(`art/${source}.png`);
  const { width: W, height: H } = await img.metadata();
  const [fx, fy] = Array.isArray(crop) ? crop : [crop, crop];
  const cw = Math.round(W * fx), ch = Math.round(H * fy);
  if (fx < 1 || fy < 1) img = img.extract({ left: Math.round((W - cw) / 2), top: Math.round((H - ch) / 2), width: cw, height: ch });

  // Master at the largest size, cut out once, then downscale from it.
  img = img.resize({ width: Math.max(...widths) });
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (transparent) cutout(data, info.width, info.height);
  const master = () => sharp(data, { raw: info });

  for (const w of widths) {
    const a = await master().resize({ width: w }).avif({ quality: 55, effort: 6 }).toFile(`public/art/${name}-${w}.avif`);
    const b = await master().resize({ width: w }).webp({ quality: 78, alphaQuality: 85 }).toFile(`public/art/${name}-${w}.webp`);
    total += a.size;
    console.log(`${name}-${w}`, `avif ${Math.round(a.size / 1024)}KB`, `webp ${Math.round(b.size / 1024)}KB`);
  }

  // 16px blurred preview, only for opaque images (it would show through transparent ones).
  const lqip = transparent ? null :
    "data:image/webp;base64," + (await master().resize({ width: 16 }).webp({ quality: 40 }).toBuffer()).toString("base64");
  manifest[name] = { w: info.width, h: info.height, widths, lqip };
}

fs.writeFileSync("src/lib/art.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`AVIF total (all sizes): ${Math.round(total / 1024)}KB`);
