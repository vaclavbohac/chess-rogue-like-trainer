import { describe, it, expect } from "vitest";
import { compileBook } from "./book";
import { buildGauntlet } from "./gauntlet";
import { FIXTURE_TREE } from "./fixture";
import { makeRng } from "./rng";

const book = compileBook(FIXTURE_TREE);

describe("buildGauntlet", () => {
  it("covers exactly the variations unlocked at the tier (no more, no less)", () => {
    const t1 = buildGauntlet(book, 1, makeRng(1)).map((v) => v.id).sort();
    expect(t1).toEqual(["advance", "exchange"]);

    const t2 = buildGauntlet(book, 2, makeRng(1)).map((v) => v.id).sort();
    expect(t2).toEqual(["advance", "classical", "exchange"]);
  });

  it("includes every unlocked variation exactly once (coverage guarantee)", () => {
    const g = buildGauntlet(book, 2, makeRng(5));
    expect(g.length).toBe(3);
    expect(new Set(g.map((v) => v.id)).size).toBe(3);
  });

  it("orders deterministically per seed and varies across seeds", () => {
    const a = buildGauntlet(book, 2, makeRng(11)).map((v) => v.id);
    const b = buildGauntlet(book, 2, makeRng(11)).map((v) => v.id);
    expect(a).toEqual(b);

    // At least one seed should produce a different order than another.
    const orders = new Set(
      [1, 2, 3, 4, 5, 6, 7, 8].map((s) =>
        buildGauntlet(book, 2, makeRng(s))
          .map((v) => v.id)
          .join(","),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});
