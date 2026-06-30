import { useId } from "react";

type LogoProps = {
  /** Pixel size of the mark (square). */
  size?: number;
  /** Show the "OPENBAARA" wordmark next to the mark. */
  showWord?: boolean;
  className?: string;
};

/**
 * OpenBaara brand mark — an orchestration node graph (agentic brain):
 * a central hub linked to satellite nodes, in the Ivorian orange→green gradient.
 */
export function LogoMark({ size = 30 }: { size?: number }) {
  const gid = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={`${gid}-g`} x1="3" y1="4" x2="29" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2BFF88" />
          <stop offset="0.55" stopColor="#00D95A" />
          <stop offset="1" stopColor="#00A847" />
        </linearGradient>
      </defs>
      {/* connections */}
      <g stroke={`url(#${gid}-g)`} strokeWidth="1.7" strokeLinecap="round" opacity="0.9">
        <line x1="16" y1="16" x2="16" y2="5.5" />
        <line x1="16" y1="16" x2="6.5" y2="24.5" />
        <line x1="16" y1="16" x2="25.5" y2="24.5" />
      </g>
      {/* hub */}
      <circle cx="16" cy="16" r="4.4" fill={`url(#${gid}-g)`} />
      <circle cx="16" cy="16" r="4.4" fill="#fff" opacity="0.18" />
      {/* satellites */}
      <circle cx="16" cy="5.5" r="3" fill="#2BFF88" />
      <circle cx="6.5" cy="24.5" r="3" fill="#00D95A" />
      <circle cx="25.5" cy="24.5" r="3" fill="#00A847" />
    </svg>
  );
}

export function Logo({ size = 30, showWord = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showWord && (
        <span className="font-display font-semibold text-[1.32rem] leading-none tracking-tight">
          <span>OPEN</span>
          <span className="text-muted dark:text-muted-dark">BAARA</span>
        </span>
      )}
    </span>
  );
}
