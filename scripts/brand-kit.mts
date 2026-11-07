// Construit le kit d'identité OpenBaara (logos, icônes, réseaux, impression, charte)
// à partir de la source du logo, src/lib/brand.ts.
//
//   npx tsx scripts/brand-kit.mts            → dossier brand/ du projet
//   npx tsx scripts/brand-kit.mts <dossier>  → autre dossier
//
// Les icônes du site (favicon, apple-icon) viennent de scripts/generate-icons.ts : lancez-le d'abord.
/* eslint-disable @typescript-eslint/no-explicit-any -- pdfkit et svg-to-pdfkit ne fournissent pas de types. */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync, copyFileSync, createWriteStream } from "node:fs";
import { join, resolve } from "node:path";
import { BRAND, MARK, logoSvg } from "../src/lib/brand";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(process.argv[2] ?? join(ROOT, "brand"));
const require = createRequire(import.meta.url);
const { Resvg } = require("@resvg/resvg-js");
const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");
const GEIST = join(ROOT, "node_modules/geist");
const FONTS = join(GEIST, "dist/fonts/geist-sans");
const F = { regular: join(FONTS, "Geist-Regular.ttf"), medium: join(FONTS, "Geist-Medium.ttf"), semi: join(FONTS, "Geist-SemiBold.ttf") };

const K = BRAND.ink, W = BRAND.paper, GREY = "#6B6B72";
const dir = (p: string) => { const d = join(OUT, p); mkdirSync(d, { recursive: true }); return d; };
const png = (svg: string, width: number, file: string) => {
  const r = new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { fontFiles: Object.values(F), loadSystemFonts: false, defaultFontFamily: "Geist" } });
  writeFileSync(file, r.render().asPng());
};
const pdf = (file: string, size: [number, number], draw: (doc: any) => void) =>
  new Promise<void>((res) => {
    const doc = new PDFDocument({ size, margin: 0, info: { Title: "OpenBaara", Author: "OpenBaara" } });
    doc.registerFont("Geist", F.regular); doc.registerFont("Geist-Medium", F.medium); doc.registerFont("Geist-SemiBold", F.semi);
    const s = createWriteStream(file); doc.pipe(s); draw(doc); doc.end(); s.on("finish", () => res());
  });
const mm = (v: number) => (v * 72) / 25.4;

// ─── 01 Logo ───
const L = dir("01-logo");
const variants = [
  ["horizontal", "horizontal"], ["empile", "stacked"], ["symbole", "mark"],
] as const;
for (const [name, lockup] of variants) {
  for (const [cname, color] of [["noir", K], ["blanc", W]] as const) {
    const base = `openbaara-${name}-${cname}`;
    const svg = logoSvg({ lockup, color });
    writeFileSync(join(dir("01-logo/svg"), `${base}.svg`), svg + "\n");
    for (const wpx of lockup === "mark" ? [512, 1024, 2048] : [1000, 2000, 4000]) png(svg, wpx, join(dir("01-logo/png-transparent"), `${base}-${wpx}px.png`));
    const bg = cname === "noir" ? W : K;
    png(logoSvg({ lockup, color, background: bg, pad: 0.6 }), lockup === "mark" ? 1024 : 2000, join(dir("01-logo/png-sur-fond"), `${base}-sur-${cname === "noir" ? "blanc" : "noir"}.png`));
  }
  // PDF vectoriel pour l'impression : noir sur blanc et blanc sur noir, avec la zone de protection.
  for (const [cname, color, bg] of [["noir", K, W], ["blanc", W, K]] as const) {
    const svg = logoSvg({ lockup, color, background: bg, pad: 0.5 });
    const [, , vw, vh] = svg.match(/viewBox="([^"]+)"/)![1].split(" ").map(Number);
    const wpt = mm(lockup === "mark" ? 40 : 90), hpt = (wpt * vh) / vw;
    await pdf(join(dir("01-logo/pdf-impression"), `openbaara-${name}-${cname}.pdf`), [wpt, hpt], (d) => SVGtoPDF(d, svg, 0, 0, { width: wpt, height: hpt }));
  }
}

// ─── 02 Icônes ───
const I = dir("02-icones");
for (const f of ["src/app/favicon.ico", "src/app/icon.svg"]) copyFileSync(join(ROOT, f), join(I, f.split("/").pop()!));
copyFileSync(join(ROOT, "src/app/apple-icon.png"), join(I, "icone-apple-180.png"));
const appIcon = (scale: number, variant: "regular" | "small" = "regular") => {
  const m = MARK[variant];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${K}"/><g transform="translate(24 24) scale(${scale}) translate(-24 -24)" fill="${W}"><path d="${m.body}"/><path d="${m.flap}"/></g></svg>`;
};
for (const s of [192, 512, 1024]) png(appIcon(s === 1024 ? 0.6 : 0.52), s, join(I, `icone-application-${s}.png`));

// ─── 03 Réseaux sociaux ───
const R = dir("03-reseaux-sociaux");
const canvas = (w: number, h: number, bg: string, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;
const place = (svg: string, x: number, y: number, width: number) => {
  const [vx, vy, vw] = svg.match(/viewBox="([^"]+)"/)![1].split(" ").map(Number);
  const k = width / vw;
  return `<g transform="translate(${x} ${y}) scale(${k}) translate(${-vx} ${-vy})">${svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g>`;
};
const sizeOf = (svg: string, width: number) => { const [, , vw, vh] = svg.match(/viewBox="([^"]+)"/)![1].split(" ").map(Number); return (width * vh) / vw; };
for (const [cname, fg, bg] of [["noir", W, K], ["blanc", K, W]] as const) {
  const mk = logoSvg({ lockup: "mark", color: fg });
  png(canvas(800, 800, bg, place(mk, 220, 220, 360)), 800, join(R, `photo-de-profil-fond-${cname}.png`));
}
const H = logoSvg({ lockup: "horizontal", color: W });
const tag = (x: number, y: number, size: number, text: string, color = "#B8B8B3", anchor = "start") => `<text x="${x}" y="${y}" font-family="Geist" font-size="${size}" fill="${color}" text-anchor="${anchor}" letter-spacing="-0.01em">${text}</text>`;
png(canvas(1200, 630, K, place(H, 100, 230, 560) + tag(100, 450, 34, "Studio de ventures technologiques. Abidjan, Côte d'Ivoire.") + tag(100, 510, 26, "openbaara.com", "#8B8B86")), 1200, join(R, "image-de-partage-1200x630.png"));
// La photo de profil LinkedIn recouvre le coin bas gauche : tout est aligné à droite.
png(canvas(1584, 396, K, place(H, 1584 - 120 - 440, 112, 440) + tag(1584 - 120, 268, 28, "Nous bâtissons les entreprises technologiques", "#B8B8B3", "end") + tag(1584 - 120, 306, 28, "de l'Afrique de l'Ouest.", "#B8B8B3", "end")), 1584, join(R, "banniere-linkedin-1584x396.png"));
png(canvas(1500, 500, K, place(H, (1500 - 600) / 2, (500 - sizeOf(H, 600)) / 2, 600)), 1500, join(R, "banniere-x-1500x500.png"));
png(canvas(1080, 1080, K, place(logoSvg({ lockup: "stacked", color: W }), 290, 330, 500) + tag(540, 860, 30, "Studio de ventures · Abidjan", "#8B8B86", "middle")), 1080, join(R, "publication-carree-1080.png"));
png(canvas(1080, 1920, K, place(logoSvg({ lockup: "stacked", color: W }), 240, 740, 600) + tag(540, 1700, 34, "openbaara.com", "#8B8B86", "middle")), 1080, join(R, "story-1080x1920.png"));

// ─── 04 Impression ───
const P = dir("04-impression");
const bleed = mm(3);
const card: [number, number] = [mm(85) + 2 * bleed, mm(55) + 2 * bleed];
// Recto : fond noir, signe blanc centré.
await pdf(join(P, "carte-de-visite-recto.pdf"), card, (d) => {
  d.rect(0, 0, card[0], card[1]).fill(K);
  const m = logoSvg({ lockup: "mark", color: W }); const w = mm(16);
  SVGtoPDF(d, m, (card[0] - w) / 2, (card[1] - w) / 2, { width: w, height: w });
});
// Verso : fond blanc, logo horizontal, coordonnées.
await pdf(join(P, "carte-de-visite-verso.pdf"), card, (d) => {
  const x = bleed + mm(7), top = bleed + mm(7);
  const h = logoSvg({ lockup: "horizontal", color: K }); const w = mm(30);
  SVGtoPDF(d, h, x, top, { width: w, height: (w * sizeOf(h, 100)) / 100 });
  let y = bleed + mm(27);
  d.font("Geist-SemiBold").fontSize(8.5).fillColor(K).text("Yannick Benewende Rapadamnaba", x, y, { lineBreak: false });
  d.font("Geist").fontSize(7).fillColor(GREY).text("Fondateur et président", x, y + 11, { lineBreak: false });
  y = bleed + mm(41);
  d.font("Geist").fontSize(7).fillColor(K);
  ["contact@openbaara.com", "openbaara.com", "Abidjan, Côte d'Ivoire"].forEach((t, k) => d.text(t, x, y + k * 9.5, { lineBreak: false }));
});
// Papier à en-tête A4.
await pdf(join(P, "papier-en-tete-A4.pdf"), "A4" as any, (d) => {
  const [pw, ph] = [595.28, 841.89];
  const h = logoSvg({ lockup: "horizontal", color: K }); const w = mm(42);
  SVGtoPDF(d, h, mm(20), mm(18), { width: w, height: (w * sizeOf(h, 100)) / 100 });
  d.moveTo(mm(20), ph - mm(22)).lineTo(pw - mm(20), ph - mm(22)).lineWidth(0.4).strokeColor("#CFCFCA").stroke();
  d.font("Geist").fontSize(7.5).fillColor(GREY).text("OpenBaara · Abidjan, Côte d'Ivoire · contact@openbaara.com · openbaara.com", mm(20), ph - mm(17), { width: pw - mm(40), lineBreak: false });
});
// Signature e-mail (le logo est servi par le site une fois en ligne).
writeFileSync(join(P, "signature-email.html"), `<table cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;color:#0A0A0A;font-size:13px;line-height:1.5">
  <tr><td style="padding-bottom:10px"><img src="https://openbaara.com/brand/openbaara-horizontal-noir-1000px.png" alt="OpenBaara" width="150" style="display:block"></td></tr>
  <tr><td><strong>Yannick Benewende Rapadamnaba</strong><br><span style="color:#6B6B72">Fondateur et président</span></td></tr>
  <tr><td style="padding-top:8px"><a href="mailto:contact@openbaara.com" style="color:#0A0A0A">contact@openbaara.com</a> · <a href="https://openbaara.com" style="color:#0A0A0A">openbaara.com</a><br><span style="color:#6B6B72">Abidjan, Côte d'Ivoire</span></td></tr>
</table>
`);
// Sources modifiables de la carte (SVG à l'échelle, en millimètres).
writeFileSync(join(P, "carte-de-visite-sources.txt"), "Les PDF sont prêts pour l'imprimeur : format 85 × 55 mm, 3 mm de fond perdu, textes en Geist incorporée, logo vectoriel.\nPour changer les coordonnées (téléphone, autre personne), modifiez scripts/brand-kit.mts dans le projet du site puis relancez-le, ou retouchez le PDF dans un éditeur vectoriel.\n");

// ─── 05 Dépôt de marque ───
const D = dir("05-depot-de-marque");
// 8 × 8 cm à 300 ppp, noir sur blanc : format courant des offices de marques (OAPI).
png(logoSvg({ lockup: "horizontal", color: K, background: W, pad: 0.3 }), 945, join(D, "openbaara-marque-horizontale-8cm-300ppp.png"));
png(logoSvg({ lockup: "mark", color: K, background: W, pad: 0.3 }), 945, join(D, "openbaara-symbole-8cm-300ppp.png"));
copyFileSync(join(L, "pdf-impression/openbaara-horizontal-noir.pdf"), join(D, "openbaara-marque-vectorielle.pdf"));

// ─── 06 Typographie ───
const T = dir("06-typographie");
for (const f of ["Geist-Regular.ttf", "Geist-Medium.ttf", "Geist-SemiBold.ttf", "Geist-Bold.ttf"]) copyFileSync(join(FONTS, f), join(T, f));
copyFileSync(join(GEIST, "LICENSE.TXT"), join(T, "LICENCE-OFL.txt"));

// ─── Charte graphique (PDF A4) ───
const A4: [number, number] = [595.28, 841.89];
const M0 = mm(20);
const putSvg = (d: any, svg: string, x: number, y: number, w: number) => SVGtoPDF(d, svg, x, y, { width: w, height: (w * sizeOf(svg, 100)) / 100 });
const h1 = (d: any, t: string, y = M0) => d.font("Geist-SemiBold").fontSize(26).fillColor(K).text(t, M0, y, { characterSpacing: -0.6 });
const p = (d: any, t: string, x: number, y: number, w = A4[0] - 2 * M0, size = 10.5, color = "#3E3E44") => d.font("Geist").fontSize(size).fillColor(color).text(t, x, y, { width: w, lineGap: 3 });
const label = (d: any, t: string, x: number, y: number) => d.font("Geist-Medium").fontSize(8).fillColor(GREY).text(t, x, y, { lineBreak: false });
const foot = (d: any, n: number) => d.font("Geist").fontSize(7.5).fillColor(GREY).text(`OpenBaara · Charte graphique · ${n}`, M0, A4[1] - mm(12), { lineBreak: false });
await pdf(join(OUT, "charte-graphique-openbaara.pdf"), A4, (d) => {
  // 1. Couverture
  d.rect(0, 0, A4[0], A4[1]).fill(K);
  putSvg(d, logoSvg({ lockup: "stacked", color: W }), (A4[0] - mm(80)) / 2, mm(95), mm(80));
  d.font("Geist").fontSize(10).fillColor("#8B8B86").text("Charte graphique · version 1 · novembre 2026", 0, A4[1] - mm(30), { width: A4[0], align: "center" });

  // 2. Le signe
  d.addPage(); h1(d, "Le signe");
  putSvg(d, logoSvg({ lockup: "mark", color: K }), M0, mm(42), mm(55));
  p(d, "Le pli. Une page dont on replie le coin : un dossier qu'on ouvre, une idée qui devient une entreprise. Le signe dit la méthode du studio : écrire avant de construire, puis transformer ce qui est écrit en produit.", M0 + mm(70), mm(44), A4[0] - 2 * M0 - mm(70));
  p(d, "Il est fait de deux formes pleines séparées par un jour. Il ne dépend jamais de la couleur du fond : il se pose tel quel sur du blanc, du noir ou une photo sombre.", M0 + mm(70), mm(80), A4[0] - 2 * M0 - mm(70));
  label(d, "VERSION PETITE TAILLE", M0, mm(115));
  p(d, "En dessous de 20 px ou de 6 mm, utilisez la version au jour élargi (fichiers « favicon » et « icon.svg ») : le pli reste lisible dans un onglet de navigateur.", M0, mm(122));
  foot(d, 2);

  // 3. Les versions
  d.addPage(); h1(d, "Les versions");
  const tile = (x: number, y: number, w: number, hh: number, bg: string, svg: string, lw: number) => { d.rect(x, y, w, hh).fill(bg); if (bg === W) d.rect(x, y, w, hh).lineWidth(0.5).strokeColor("#E1E1DC").stroke(); putSvg(d, svg, x + (w - lw) / 2, y + (hh - (lw * sizeOf(svg, 100)) / 100) / 2, lw); };
  const cw = (A4[0] - 2 * M0 - mm(6)) / 2;
  let y = mm(40);
  for (const [lk, t, desc, lw] of [["horizontal", "Horizontal", "La version principale : site, documents, signatures, en-têtes.", mm(55)], ["stacked", "Empilé", "Formats carrés ou verticaux : affiches, réseaux, kakémonos.", mm(38)], ["mark", "Symbole", "Quand la marque est déjà connue ou l'espace réduit : icônes, avatars, tampons.", mm(18)]] as const) {
    tile(M0, y, cw, mm(42), W, logoSvg({ lockup: lk, color: K }), lw);
    tile(M0 + cw + mm(6), y, cw, mm(42), K, logoSvg({ lockup: lk, color: W }), lw);
    d.font("Geist-SemiBold").fontSize(11).fillColor(K).text(t, M0, y + mm(45));
    p(d, desc, M0, y + mm(51), A4[0] - 2 * M0, 9.5);
    y += mm(68);
  }
  p(d, "Deux couleurs seulement : noir sur fond clair, blanc sur fond sombre.", M0, y, A4[0] - 2 * M0, 9.5, GREY);
  foot(d, 3);

  // 4. Protection et tailles minimales
  d.addPage(); h1(d, "Espace et tailles");
  const lw = mm(100), lx = M0 + mm(20), ly = mm(62);
  const hsvg = logoSvg({ lockup: "horizontal", color: K });
  const lh = (lw * sizeOf(hsvg, 100)) / 100;
  const unit = lh / 2; // la moitié de la hauteur du signe
  d.rect(lx - unit, ly - unit, lw + 2 * unit, lh + 2 * unit).dash(3, { space: 3 }).lineWidth(0.6).strokeColor("#9A9A9A").stroke().undash();
  putSvg(d, hsvg, lx, ly, lw);
  p(d, "Zone de protection : laissez autour du logo un espace vide au moins égal à la moitié de la hauteur du signe. Aucun texte, bord ni image dans cette zone.", M0, ly + lh + unit + mm(12));
  label(d, "TAILLES MINIMALES", M0, mm(150));
  const rows = [["Logo horizontal", "25 mm de large à l'impression · 100 px à l'écran"], ["Logo empilé", "18 mm de large · 72 px"], ["Symbole", "6 mm · 20 px (en dessous : version petite taille)"]];
  rows.forEach(([a, b], k) => { d.font("Geist-Medium").fontSize(10).fillColor(K).text(a, M0, mm(158) + k * 18, { lineBreak: false }); d.font("Geist").fontSize(10).fillColor("#3E3E44").text(b, M0 + mm(45), mm(158) + k * 18, { lineBreak: false }); });
  foot(d, 4);

  // 5. Couleurs
  d.addPage(); h1(d, "Couleurs");
  const sw = [
    [K, "Noir OpenBaara", "#0A0A0A · RVB 10 10 10", "Texte : noir 100 %. Grands aplats imprimés : noir riche C60 M40 Y40 N100."],
    [W, "Blanc", "#FFFFFF · RVB 255 255 255", "Fond principal, ou logo sur fond noir."],
    ["#6B6B72", "Gris texte", "#6B6B72 · RVB 107 107 114", "Mentions, légendes, textes secondaires."],
    ["#EDEDEA", "Gris papier", "#EDEDEA · RVB 237 237 234", "Fonds de section, cartes."],
  ] as const;
  sw.forEach(([c, n, v, use], k) => {
    const yy = mm(42) + k * mm(38);
    d.rect(M0, yy, mm(40), mm(30)).fill(c); if (c === W || c === "#EDEDEA") d.rect(M0, yy, mm(40), mm(30)).lineWidth(0.5).strokeColor("#E1E1DC").stroke();
    d.font("Geist-SemiBold").fontSize(11).fillColor(K).text(n, M0 + mm(48), yy + 4);
    d.font("Geist").fontSize(9.5).fillColor(GREY).text(v, M0 + mm(48), yy + 20);
    p(d, use, M0 + mm(48), yy + 36, A4[0] - 2 * M0 - mm(48), 9.5);
  });
  p(d, "Le site utilise aussi un vert d'accent (#1D6B52, et #72C9A5 sur fond sombre) pour les liens et les états. Il n'entre jamais dans le logo. Chaque venture garde sa propre couleur.", M0, mm(200), A4[0] - 2 * M0, 9.5, GREY);
  foot(d, 5);

  // 6. Typographie
  d.addPage(); h1(d, "Typographie");
  d.font("Geist-SemiBold").fontSize(54).fillColor(K).text("Geist", M0, mm(42), { characterSpacing: -2 });
  p(d, "Une seule famille, Geist, sous licence libre (SIL Open Font License) : utilisable sans frais pour le site, l'impression et la publicité. Les fichiers sont dans le dossier 06-typographie.", M0, mm(70));
  [["SemiBold", "Titres et logo · interlettrage −3 %", "Geist-SemiBold", 20], ["Medium", "Intertitres, boutons, libellés", "Geist-Medium", 14], ["Regular", "Textes courants, documents", "Geist", 12]].forEach(([w, use, f, s], k) => {
    const yy = mm(95) + k * mm(22);
    d.font(f as string).fontSize(s as number).fillColor(K).text("Nous bâtissons des entreprises", M0, yy, { lineBreak: false });
    d.font("Geist").fontSize(8.5).fillColor(GREY).text(`${w} · ${use}`, M0, yy + (s as number) + 6, { lineBreak: false });
  });
  foot(d, 6);

  // 7. À éviter
  d.addPage(); h1(d, "À éviter");
  const bad = [
    ["Déformer", (x: number, yy: number) => SVGtoPDF(d, logoSvg({ lockup: "horizontal", color: K }), x, yy + mm(8), { width: mm(70), height: mm(8), preserveAspectRatio: "none" })],
    ["Changer la couleur", (x: number, yy: number) => putSvg(d, logoSvg({ lockup: "horizontal", color: "#C2352F" }), x, yy + mm(6), mm(70))],
    ["Poser sur un fond chargé", (x: number, yy: number) => { for (let i = 0; i < 9; i++) d.rect(x + i * mm(8), yy, mm(8), mm(26)).fill(i % 2 ? "#B3502F" : "#2C55D9"); putSvg(d, logoSvg({ lockup: "horizontal", color: K }), x + mm(4), yy + mm(8), mm(64)); }],
    ["Pivoter ou recomposer", (x: number, yy: number) => { d.save(); d.rotate(-12, { origin: [x + mm(35), yy + mm(13)] }); putSvg(d, logoSvg({ lockup: "horizontal", color: K }), x + mm(2), yy + mm(6), mm(66)); d.restore(); }],
  ] as const;
  bad.forEach(([t, draw], k) => {
    const x = M0 + (k % 2) * mm(88), yy = mm(42) + Math.floor(k / 2) * mm(58);
    d.rect(x - mm(3), yy - mm(3), mm(80), mm(34)).lineWidth(0.5).strokeColor("#E1E1DC").stroke();
    draw(x + mm(2), yy);
    d.font("Geist-Medium").fontSize(10).fillColor("#B3261E").text(`×  ${t}`, x - mm(3), yy + mm(35), { lineBreak: false });
  });
  p(d, "N'ajoutez ni ombre, ni contour, ni dégradé. Ne réécrivez pas le nom dans une autre police : utilisez toujours les fichiers fournis.", M0, mm(165));
  foot(d, 7);

  // 8. Les fichiers
  d.addPage(); h1(d, "Quel fichier pour quoi");
  const files = [
    ["Imprimeur, signalétique, objets", "01-logo/pdf-impression (vectoriel)"],
    ["Site, présentations, documents", "01-logo/svg ou png-transparent"],
    ["Fond déjà coloré dans le fichier", "01-logo/png-sur-fond"],
    ["Onglet du navigateur, téléphone", "02-icones"],
    ["LinkedIn, X, WhatsApp, Instagram", "03-reseaux-sociaux"],
    ["Cartes de visite, courriers", "04-impression"],
    ["Dépôt de la marque (OAPI)", "05-depot-de-marque"],
    ["Polices", "06-typographie"],
  ];
  files.forEach(([a, b], k) => {
    const yy = mm(42) + k * mm(13);
    d.moveTo(M0, yy - 6).lineTo(A4[0] - M0, yy - 6).lineWidth(0.4).strokeColor("#E1E1DC").stroke();
    d.font("Geist").fontSize(10.5).fillColor(K).text(a, M0, yy, { lineBreak: false });
    d.font("Geist-Medium").fontSize(10).fillColor("#3E3E44").text(b, M0 + mm(80), yy, { lineBreak: false });
  });
  foot(d, 8);
});

writeFileSync(join(OUT, "LISEZ-MOI.md"), `# Identité OpenBaara

Le logo « le pli » et tout ce qui va avec. Version 1, novembre 2026.

Commencez par **charte-graphique-openbaara.pdf** : elle explique le signe, les versions, les couleurs, la police et ce qu'il faut éviter.

| Besoin | Dossier |
| --- | --- |
| Imprimeur, signalétique, textile, objets | \`01-logo/pdf-impression\` (vectoriel, sans perte) |
| Site, présentations, Word, Canva | \`01-logo/svg\` ou \`01-logo/png-transparent\` |
| Image avec le fond déjà mis | \`01-logo/png-sur-fond\` |
| Favicon, icônes de téléphone | \`02-icones\` |
| LinkedIn, X, WhatsApp, Instagram | \`03-reseaux-sociaux\` |
| Cartes de visite, papier à en-tête, signature e-mail | \`04-impression\` |
| Dépôt de la marque à l'OAPI | \`05-depot-de-marque\` |
| Police Geist (licence libre) | \`06-typographie\` |

## Couleurs

- Noir \`#0A0A0A\` (impression : texte en noir 100 %, grands aplats en noir riche C60 M40 Y40 N100)
- Blanc \`#FFFFFF\`
- Gris texte \`#6B6B72\`, gris papier \`#EDEDEA\`

## À compléter

- **Carte de visite** : le téléphone n'y figure pas. Ajoutez-le avant impression si vous le souhaitez.
- **Papier à en-tête et factures** : une fois la société immatriculée, ajoutez la forme juridique, le capital, le siège, le numéro RCCM et le compte contribuable, obligatoires sur les documents commerciaux.
- **Dépôt de marque** : faites vérifier par un conseil en propriété industrielle que le signe et le nom sont disponibles, puis déposez-les à l'OAPI (classes à choisir avec lui, par exemple 35, 36, 41 et 42).
- **Signature e-mail** : l'image du logo est chargée depuis openbaara.com ; elle s'affichera une fois le site en ligne.

## Mise à jour

Les fichiers sont générés à partir de la source du logo dans le site (\`src/lib/brand.ts\`). Pour changer le dessin, modifiez cette source puis lancez \`npm run brand:kit\` dans le projet, plutôt que de retoucher les fichiers un par un.
`);

console.log("kit OK");
