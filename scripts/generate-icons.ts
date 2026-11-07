// Génère les icônes du site à partir de la géométrie de src/lib/brand.ts, sans outil externe :
// favicon.ico (16, 32, 48), icon.svg, apple-icon.png (180), icônes Android (192, 512).
//
//   npx tsx scripts/generate-icons.ts
//
// Le signe est rastérisé avec un suréchantillonnage 4 × 4 pour lisser les bords.

import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { BRAND, MARK, type MarkVariant } from "../src/lib/brand";

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;

/** Le point (x, y), en unités du repère 48, est-il dans un carré arrondi ? */
function inRoundRect(x: number, y: number, x0: number, y0: number, x1: number, y1: number, r: number) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function inMark(x: number, y: number, variant: MarkVariant) {
  const m = MARK[variant];
  const page = inRoundRect(x, y, 4, 4, 44, 44, 10) && !(x > m.notch.x && y < m.notch.y);
  const flap = x >= m.flapBox.x && y <= m.flapBox.y && y >= x - m.diagonal;
  return page || flap;
}

type Plate = { size: number; radius: number; scale: number; variant: MarkVariant };

/** Fond encre (carré, ou arrondi en proportion de `radius`), signe blanc centré à `scale`. */
function render({ size, radius, scale, variant }: Plate): Buffer {
  const ink = hex(BRAND.ink);
  const paper = hex(BRAND.paper);
  const S = 4;
  const px = Buffer.alloc(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      let bg = 0;
      let fg = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const u = ((i + (sx + 0.5) / S) / size) * 48;
          const v = ((j + (sy + 0.5) / S) / size) * 48;
          if (radius === 0 || inRoundRect(u, v, 0, 0, 48, 48, radius)) {
            bg++;
            const mu = 24 + (u - 24) / scale;
            const mv = 24 + (v - 24) / scale;
            if (inMark(mu, mv, variant)) fg++;
          }
        }
      }
      const a = bg / (S * S);
      const t = bg ? fg / bg : 0;
      const o = (j * size + i) * 4;
      for (let c = 0; c < 3; c++) px[o + c] = Math.round(ink[c] * (1 - t) + paper[c] * t);
      px[o + 3] = Math.round(a * 255);
    }
  }
  return png(size, px);
}

// ─── PNG et ICO minimalistes ───

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (b: Buffer) => {
  let c = -1;
  for (const byte of b) c = CRC[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type: string, data: Buffer) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

function png(size: number, rgba: Buffer): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // profondeur
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function ico(images: { size: number; data: Buffer }[]): Buffer {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, k) => {
    const e = 6 + 16 * k;
    head[e] = size === 256 ? 0 : size;
    head[e + 1] = size === 256 ? 0 : size;
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.data)]);
}

// ─── Fichiers ───

// Onglets : carré arrondi, signe ouvert pour les petites tailles.
const tab = (size: number) => render({ size, radius: 11, scale: 0.68, variant: "small" });
writeFileSync("src/app/favicon.ico", ico([16, 32, 48].map((size) => ({ size, data: tab(size) }))));

const s = MARK.small;
writeFileSync(
  "src/app/icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="${BRAND.ink}"/><g transform="translate(24 24) scale(0.68) translate(-24 -24)" fill="${BRAND.paper}"><path d="${s.body}"/><path d="${s.flap}"/></g></svg>\n`,
);

// Écran d'accueil iPhone : carré plein (iOS arrondit lui-même).
writeFileSync("src/app/apple-icon.png", render({ size: 180, radius: 0, scale: 0.6, variant: "regular" }));

// Android : signe dans la zone sûre des icônes masquables.
for (const size of [192, 512]) {
  writeFileSync(`public/icon-${size}.png`, render({ size, radius: 0, scale: 0.52, variant: "regular" }));
}

console.log("Icônes générées : favicon.ico, icon.svg, apple-icon.png, icon-192.png, icon-512.png");
