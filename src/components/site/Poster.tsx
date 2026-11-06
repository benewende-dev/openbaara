/** Visuel d'une venture ou d'une offre : sa couleur de marque et son nom, en attendant son film. */
export function Poster({
  color,
  name,
  ratio = "16/10",
  size = "md",
}: {
  color: string;
  name: string;
  ratio?: string;
  size?: "sm" | "md" | "lg";
}) {
  const fontSize = size === "lg" ? "clamp(44px, 6vw, 76px)" : size === "md" ? "clamp(32px, 3.4vw, 40px)" : "28px";
  return (
    <span className="poster" style={{ aspectRatio: ratio }} aria-hidden="true">
      <span
        className="art"
        style={{
          background: `radial-gradient(120% 90% at 85% 0%, ${color} 0%, transparent 60%), radial-gradient(90% 80% at 0% 100%, color-mix(in srgb, ${color} 55%, #000) 0%, transparent 70%), linear-gradient(160deg, color-mix(in srgb, ${color} 60%, #0B0B0D), #0B0B0D 75%)`,
        }}
      />
      <span className="grain" />
      <span className="name" style={{ fontSize }}>
        {name}
      </span>
    </span>
  );
}
