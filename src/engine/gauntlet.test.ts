import { describe, it, expect } from "vitest";
import { compileBook } from "./book";
import { buildGauntlet } from "./gauntlet";
import { FIXTURE_TREE } from "./fixture";
import { makeRng } from "./rng";

const book = compileBook(FIXTURE_TREE);

describe("buildGauntlet", () => {
  it("covers every variation exactly once (total coverage)", () => {
    const g = buildGauntlet(book, makeRng(1));
    expect(g.map((v) => v.id).sort()).toEqual(["advance", "classical", "exchange"]);
    expect(new Set(g.map((v) => v.id)).size).toBe(g.length);
  });

  it("groups by tier ascending (tiers are non-decreasing along the gauntlet)", () => {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const g = buildGauntlet(book, makeRng(seed));
      const tiers = g.map((v) => v.tier);
      expect(tiers).toEqual([...tiers].sort((a, b) => a - b));
      // Tier 1 (advance + exchange) first, the tier-2 classical last.
      expect(new Set([g[0]!.id, g[1]!.id])).toEqual(new Set(["advance", "exchange"]));
      expect(g[g.length - 1]!.id).toBe("classical");
    }
  });

  it("shuffles within a tier deterministically per seed, varying across seeds", () => {
    const a = buildGauntlet(book, makeRng(11)).map((v) => v.id);
    const b = buildGauntlet(book, makeRng(11)).map((v) => v.id);
    expect(a).toEqual(b);

    // The two tier-1 variations should appear in both possible orders across seeds.
    const firsts = new Set(
      [1, 2, 3, 4, 5, 6, 7, 8].map((s) => buildGauntlet(book, makeRng(s))[0]!.id),
    );
    expect(firsts).toEqual(new Set(["advance", "exchange"]));
  });
});
