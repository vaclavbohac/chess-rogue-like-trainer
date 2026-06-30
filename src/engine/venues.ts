/**
 * Tier -> themed Venue mapping. A Tier is displayed by its Venue name, never as
 * "Tier N" (CONTEXT.md / ADR-0003). Kept framework-free so both the engine (RunView)
 * and the UI (Home/Interstitial) can import a single source of truth for labels.
 */
export interface Venue {
  tier: number;
  name: string;
}

export const VENUES: Venue[] = [
  { tier: 1, name: "The Pub" },
  { tier: 2, name: "The Chess Club" },
  { tier: 3, name: "The Tournament Hall" },
  { tier: 4, name: "The World Championship" },
];

/** Display label for a tier; falls back to "Tier N" for any unmapped tier. */
export function venueName(tier: number): string {
  return VENUES.find((v) => v.tier === tier)?.name ?? `Tier ${tier}`;
}
