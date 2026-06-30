/**
 * Tier -> themed Venue mapping. A Tier is displayed by its Venue name, never as
 * "Tier N" (CONTEXT.md / ADR-0003). Kept framework-free so both the engine (RunView)
 * and the UI (Home/Interstitial) can import a single source of truth for labels.
 */
export interface Venue {
  tier: number;
  name: string;
  /**
   * CSS class carrying this venue's theme palette (page bg + accent + board
   * square colors). Single source of truth shared by the Game screen, the
   * Interstitial, and Home's venue preview. Themes themselves live in style.css.
   */
  themeClass: string;
}

export const VENUES: Venue[] = [
  { tier: 1, name: "The Pub", themeClass: "venue-pub" },
  { tier: 2, name: "The Chess Club", themeClass: "venue-club" },
  { tier: 3, name: "The Tournament Hall", themeClass: "venue-hall" },
  { tier: 4, name: "The World Championship", themeClass: "venue-final" },
];

/** Display label for a tier; falls back to "Tier N" for any unmapped tier. */
export function venueName(tier: number): string {
  return VENUES.find((v) => v.tier === tier)?.name ?? `Tier ${tier}`;
}

/** Theme class for a tier; falls back to the first venue's theme for unmapped tiers. */
export function venueThemeClass(tier: number): string {
  return VENUES.find((v) => v.tier === tier)?.themeClass ?? VENUES[0]!.themeClass;
}
