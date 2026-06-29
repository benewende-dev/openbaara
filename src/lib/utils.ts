import { clsx, type ClassValue } from "clsx";

/** Merge Tailwind classes with conflict resolution via clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format price in XOF (FCFA) with thousands separator */
export function formatXOF(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

/** Format price in USD */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/** Format dual price display */
export function formatDualPrice(xof: number, usd: number): string {
  return `${formatXOF(xof)} / ${formatUSD(usd)}`;
}
