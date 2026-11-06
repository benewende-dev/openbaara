// Génère les illustrations du site avec Pixazo (Flux 2 Pro), la passerelle utilisée par Baarali.
//
//   PIXAZO_API_KEY=… node scripts/generate-illustrations.mjs [--model=seedream] [--out=dossier] [slug…]
//
// Sans slug, génère toutes les scènes absentes du dossier de sortie (public/images/illustrations par défaut).
// Ce sont des illustrations : elles montrent des usages, jamais l'équipe ni les locaux d'OpenBaara.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const KEY = process.env.PIXAZO_API_KEY;
if (!KEY) throw new Error("PIXAZO_API_KEY manquante");
const GATEWAY = "https://gateway.pixazo.ai";
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
// Nano Banana 2 (Google) : le rendu le plus juste sur nos scènes d'Afrique de l'Ouest, en 2K, pour ~0,07 $ l'image.
const MODEL = arg("model") ?? "nano-banana";
const OUT = resolve(arg("out") ?? resolve(import.meta.dirname, "../public/images/illustrations"));
mkdirSync(OUT, { recursive: true });

// Style commun : photographie documentaire, lumière naturelle, aucun texte lisible.
const STYLE =
  "Documentary editorial photograph, shot on a full-frame camera with a 35mm lens, natural light, true-to-life skin tones, subtle film grain, shallow depth of field, calm and dignified. Strictly no readable text or letters anywhere, no brand names, no logos on any device or machine (plain unbranded laptops and phones), no watermarks; every screen is softly out of focus with abstract shapes only.";

export const SCENES = {
  studio: ["landscape_16_9", "Wide view of the Plateau business district of Abidjan, Côte d'Ivoire, at dusk seen across the Ebrié lagoon, office towers with warm lit windows, a few pirogues on calm water, soft blue hour sky."],
  baarali: ["landscape_4_3", "A West African woman in her thirties running a small fabric and household goods shop in Adjamé, Abidjan, standing behind her wooden counter and replying to customer messages on her smartphone, shelves of colourful wax fabrics behind her, late morning light."],
  sahely: ["landscape_4_3", "A young Burkinabè man on a busy street in Ouagadougou at golden hour checking a ride on his smartphone, motorbikes and a taxi passing behind him, warm red laterite dust in the air, street vendors in the background."],
  jemabi: ["landscape_4_3", "A young Ivorian fashion designer in her bright atelier in Abidjan photographing a finished tailored dress made of contemporary wax print with her smartphone, a plain unbranded sewing machine, fabric rolls and a mannequin around her."],
  nafolia: ["landscape_4_3", "An elegant West African professional woman in her forties sitting by a large window in a calm modern apartment, holding a smartphone and a cup of coffee, reviewing her finances, minimalist interior, soft morning light."],
  outio: ["landscape_4_3", "A young Ivorian content creator in a small home studio in Abidjan, editing a video on a laptop next to a camera on a tripod and a soft light panel, focused expression, evening ambience."],
  colisgo: ["landscape_4_3", "A delivery rider in a helmet handing a cardboard parcel to a smiling customer at the gate of a house in a residential street of Cocody, Abidjan, scooter parked nearby, bougainvillea on the wall, afternoon light."],
  "baarali-entreprise": ["landscape_4_3", "Three West African professionals in a modern meeting room of an office tower in Abidjan Plateau reviewing a dashboard together on a large wall screen, laptops on the table, city view through the windows, serious and confident mood."],
  academy: ["landscape_4_3", "A small workshop class in Abidjan seen from the side, young adults learning on plain unbranded laptops around a long wooden table while a young woman instructor explains with a gesture, engaged and attentive, bright daylight room with plants, no whiteboard and no writing visible."],
  services: ["landscape_4_3", "Close-up of the hands of a product designer sketching simple mobile app wireframes made only of boxes and lines on paper, next to a closed unbranded laptop and a smartphone face down on a wooden desk, coffee cup, daylight, Abidjan office."],
};

async function api(path, init = {}) {
  const res = await fetch(GATEWAY + path, {
    ...init,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", "Ocp-Apim-Subscription-Key": KEY, ...init.headers },
  });
  if (!res.ok) throw new Error(`Pixazo ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

// Chemins et corps de requête repris du registre Pixazo de Baarali (lib/apis/pixazo.ts).
const ratio = (size) => (size === "landscape_16_9" ? "16:9" : size.startsWith("landscape") ? "4:3" : "1:1");
const MODELS = {
  flux: (prompt, size) => ["/flux-2-pro-text-to-image-799/v1/flux-2-pro-text-to-image-request", { prompt, image_size: size, output_format: "jpeg", enable_safety_checker: true, safety_tolerance: 2 }],
  seedream: (prompt, size) => ["/seedream-5-0-lite-text-to-image/v1/seedream-5-0-lite-text-to-image-request", { prompt, image_size: size, num_images: 1 }],
  "z-image": (prompt, size) => ["/z-image-turbo-834/v1/z-image-turbo-request", { prompt, image_size: size }],
  "gpt-image": (prompt, size) => ["/gpt-image-2/v1/text-to-image", { prompt, size: size === "landscape_16_9" ? "1536x864" : "1536x1152" }],
  "nano-banana": (prompt, size) => ["/nano-banana-2/v1/nano-banana-2-request", { prompt, num_images: 1, aspect_ratio: ratio(size), output_format: "png", resolution: "2K" }],
};

async function generate(slug, [size, scene]) {
  const file = join(OUT, `${slug}.jpg`);
  if (existsSync(file)) return console.log(`${slug} : déjà présent`);
  const [path, body] = MODELS[MODEL](`${scene} ${STYLE}`, size);
  const job = await api(path, { method: "POST", body: JSON.stringify(body) });
  const id = job.request_id ?? job.requestId ?? job.task_id ?? job.id;
  for (let t = 0; t < 60; t++) {
    await new Promise((r) => setTimeout(r, 4000));
    const s = await api(`/v2/requests/status/${id}`);
    const status = String(s.status ?? "").toUpperCase();
    if (["FAILED", "ERROR"].includes(status)) throw new Error(`${slug} : échec (${JSON.stringify(s.error ?? s).slice(0, 200)})`);
    const media = s.output?.media_url;
    const url = Array.isArray(media) ? media[0] : (media ?? s.output?.url);
    if (["COMPLETED", "SUCCEEDED", "SUCCESS"].includes(status) && url) {
      const img = await fetch(url);
      if (!img.ok) throw new Error(`${slug} : téléchargement ${img.status}`);
      // JPEG de 2000 px : assez pour les grands visuels, léger pour le site.
      const jpg = await sharp(Buffer.from(await img.arrayBuffer())).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      writeFileSync(file, jpg);
      return console.log(`${slug} : ok`);
    }
  }
  throw new Error(`${slug} : délai dépassé`);
}

const wanted = process.argv.slice(2);
const list = Object.entries(SCENES).filter(([slug]) => !wanted.length || wanted.includes(slug));
const results = await Promise.allSettled(list.map(([slug, spec]) => generate(slug, spec)));
results.forEach((r) => r.status === "rejected" && console.error(r.reason.message));
