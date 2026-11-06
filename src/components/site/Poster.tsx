import Image from "next/image";

/**
 * Visuel d'une venture ou d'une offre : l'illustration si elle existe, sinon un dégradé de sa couleur.
 * Le nom est posé en bas, sur un voile sombre qui le garde lisible.
 */
export function Poster({
  color,
  name,
  image,
  ratio = "16/10",
  size = "md",
  sizes = "(min-width: 900px) 50vw, 100vw",
  priority = false,
}: {
  color: string;
  name: string;
  image?: string;
  ratio?: string;
  size?: "sm" | "md" | "lg";
  sizes?: string;
  priority?: boolean;
}) {
  const fontSize = size === "lg" ? "clamp(44px, 6vw, 76px)" : size === "md" ? "clamp(32px, 3.4vw, 40px)" : "28px";
  return (
    <span className="poster" style={{ aspectRatio: ratio }} aria-hidden="true">
      {image ? (
        <span className="art">
          <Image src={image} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
          <span className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,.72) 0%, rgba(10,10,10,.18) 38%, transparent 60%)" }} />
        </span>
      ) : (
        <>
          <span
            className="art"
            style={{
              background: `radial-gradient(120% 90% at 85% 0%, ${color} 0%, transparent 60%), radial-gradient(90% 80% at 0% 100%, color-mix(in srgb, ${color} 55%, #000) 0%, transparent 70%), linear-gradient(160deg, color-mix(in srgb, ${color} 60%, #0B0B0D), #0B0B0D 75%)`,
            }}
          />
          <span className="grain" />
        </>
      )}
      <span className="name" style={{ fontSize }}>
        {name}
      </span>
    </span>
  );
}
