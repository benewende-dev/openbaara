import { describe, expect, it } from "vitest";
import { estimate, ESTIMATE_TYPES } from "./services";

describe("estimation de projet", () => {
  it("donne une fourchette arrondie à 50 000 F CFA", () => {
    const e = estimate("vitrine", 5, []);
    // (300 000 + 5 × 40 000) = 500 000 ; 85 % et 120 %
    expect(e).toMatchObject({ size: 5, lo: 450000, hi: 600000 });
    expect(e.lo % 50000).toBe(0);
  });

  it("ajoute le poids des options au prix et au délai", () => {
    const sans = estimate("mobile", 10, []);
    const avec = estimate("mobile", 10, ["bilingue", "paiement"]);
    expect(avec.lo).toBeGreaterThan(sans.lo);
    expect(avec.weeksLo).toBeGreaterThanOrEqual(sans.weeksLo);
  });

  it("borne la taille au maximum du type", () => {
    expect(estimate("ia", 999, []).size).toBe(ESTIMATE_TYPES.ia.max);
    expect(estimate("ia", 0, []).size).toBe(1);
  });
});
