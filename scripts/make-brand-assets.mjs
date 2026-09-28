// Builds favicon/app icons and the social share (Open Graph) image from the processed art.
//   npm run brand   (run after `npm run art`)
import fs from "node:fs";
import sharp from "sharp";

const CREAM = { r: 255, g: 246, b: 233, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

// Mascot with its paper background already cut out, trimmed to its bounds.
const mascot = await sharp("public/art/mascot-320.webp").trim({ threshold: 1 }).toBuffer();

async function icon(size, out, { pad = 0.1, background = CREAM } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(mascot).resize(inner, inner, { fit: "contain", background: CLEAR }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: m, gravity: "center" }])
    .png()
    .toFile(out);
  console.log(out);
}

await icon(512, "src/app/icon.png", { background: CLEAR, pad: 0.04 });
await icon(180, "src/app/apple-icon.png");
await icon(192, "public/icon-192.png");
await icon(512, "public/icon-512.png");
fs.rmSync("src/app/favicon.ico", { force: true }); // Next's default icon

// 1200x630 share card: branded hero illustration on cream.
const hero = await sharp("public/art/hero-brand-1200.webp").resize(1100, 590, { fit: "contain", background: CLEAR }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
  .composite([{ input: hero, gravity: "center" }])
  .flatten({ background: CREAM })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og.jpg");
console.log("public/og.jpg");
