import { MARK } from "@/lib/brand";

/** Marque OpenBaara, « le pli ». Prend la couleur du texte ; version plus ouverte en petite taille. */
export function LogoMark({ size = 22, title }: { size?: number; title?: string }) {
  const m = MARK[size <= 20 ? "small" : "regular"];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className="shrink-0"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={m.body} fill="currentColor" />
      <path d={m.flap} fill="currentColor" />
    </svg>
  );
}

export function Logo({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold text-[17px] tracking-[-0.03em] ${className}`}>
      <LogoMark size={size} />
      OpenBaara
    </span>
  );
}
