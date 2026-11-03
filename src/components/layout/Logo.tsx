/** Marque OpenBaara : un cadre et un bloc central à la couleur d'accent. */
export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="8" height="8" rx="2" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold text-[17px] tracking-[-0.02em] ${className}`}>
      <LogoMark size={size} />
      OpenBaara
    </span>
  );
}
