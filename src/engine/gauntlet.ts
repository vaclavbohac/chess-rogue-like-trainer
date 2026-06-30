import type { CompiledBook, VariationDef } from "./types";
import { shuffle, type Rng } from "./rng";

/**
 * Build the ordered list of variations for a Run at `tier`.
 *
 * Coverage guarantee (CONTEXT.md / Q9): every unlocked variation appears exactly
 * once, in random order — the player cannot dodge a weak variation. Run-to-run
 * variety comes from weighted-random White choices *inside* each encounter, handled
 * by the run engine.
 */
export function buildGauntlet(
  book: CompiledBook,
  tier: number,
  rng: Rng,
): VariationDef[] {
  const seen = new Set<string>();
  const unlocked: VariationDef[] = [];
  for (const v of book.variations) {
    if (v.tier <= tier && !seen.has(v.id)) {
      seen.add(v.id);
      unlocked.push(v);
    }
  }
  return shuffle(unlocked, rng);
}
