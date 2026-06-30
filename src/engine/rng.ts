/**
 * Deterministic, seedable RNG so gauntlet ordering and weighted White choices are
 * reproducible in tests. (Math.random is non-deterministic and untestable.)
 */
export interface Rng {
  /** Returns a float in [0, 1). */
  next(): number;
}

/** mulberry32 — tiny, fast, good-enough PRNG for game/test use. */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return {
    next() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

/** Pick one item by weight. Weights must be positive; total must be > 0. */
export function weightedPick<T>(
  items: readonly T[],
  weightOf: (item: T) => number,
  rng: Rng,
): T {
  if (items.length === 0) throw new Error("weightedPick: empty items");
  const total = items.reduce((sum, it) => sum + weightOf(it), 0);
  if (total <= 0) throw new Error("weightedPick: non-positive total weight");
  let r = rng.next() * total;
  for (const it of items) {
    r -= weightOf(it);
    if (r < 0) return it;
  }
  // Floating-point fallthrough guard.
  return items[items.length - 1]!;
}

/** In-place-free Fisher-Yates shuffle returning a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
