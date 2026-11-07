import { signedEmbedUrl } from "@/lib/courses/video";
import type { Venture } from "@/data/ventures";
import { Poster } from "./Poster";

const COPY = {
  fr: { title: (n: string) => `${n}, le film`, soon: "Film de présentation en préparation : le produit expliqué et démontré, en 3 minutes au plus." },
  en: { title: (n: string) => `${n}, the film`, soon: "Presentation film in preparation: the product explained and shown, in 3 minutes at most." },
};

/**
 * Film de présentation d'une venture (Bunny Stream, lien signé).
 * Tant qu'il n'existe pas, la place est tenue par la couleur de la venture, sans autre image.
 */
export function VentureFilm({ venture, lang }: { venture: Venture; lang: "fr" | "en" }) {
  const c = COPY[lang];
  const url = venture.film ? signedEmbedUrl(venture.film, 12 * 3600) : null;
  if (url) {
    return (
      <div className="overflow-hidden rounded-[10px] bg-black" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={url}
          title={c.title(venture.name)}
          className="h-full w-full border-0"
          loading="lazy"
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <figure className="m-0 flex flex-col gap-3">
      <Poster color={venture.color} name={venture.name} ratio="21/9" size="lg" />
      <figcaption className="small muted">{c.soon}</figcaption>
    </figure>
  );
}
