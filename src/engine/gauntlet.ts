import type { CompiledBook, VariationDef } from "./types";
import { shuffle, type Rng } from "./rng";

/**
 * Build the ordered list of variations for a Run (the Gauntlet).
 *
 * Hades model (ADR-0003): a Run always traverses *every* Tier in sequence, so the
 * gauntlet is ALL variations — total coverage — grouped by Tier ascending
 * (easiest-first) and shuffled *within* each Tier. There is no tier gate any more;
 * the player cannot dodge a variation. Run-to-run variety inside an encounter still
 * comes from weighted-random White choices, handled by the run engine.
 */
export function buildGauntlet(book: CompiledBook, rng: Rng): VariationDef[] {
  // De-dupe by id (a variation is tagged once, but stay defensive).
  const byId = new Map<string, VariationDef>();
  for (const v of book.variations) if (!byId.has(v.id)) byId.set(v.id, v);
  const all = [...byId.values()];

  const tiers = [...new Set(all.map((v) => v.tier))].sort((a, b) => a - b);
  const out: VariationDef[] = [];
  for (const tier of tiers) {
    const group = all.filter((v) => v.tier === tier);
    out.push(...shuffle(group, rng)); // random order *within* the tier
  }
  return out;
}
