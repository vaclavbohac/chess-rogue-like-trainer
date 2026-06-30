import { describe, it, expect } from "vitest";
import { makeRng, weightedPick, shuffle, type Rng } from "./rng";

/** A scripted RNG that yields a fixed list of values (then repeats the last). */
function scriptedRng(values: number[]): Rng {
  let i = 0;
  return { next: () => values[Math.min(i++, values.length - 1)]! };
}

describe("makeRng", () => {
  it("is deterministic for a given seed", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    const seqA = [a.next(), a.next(), a.next()];
    const seqB = [b.next(), b.next(), b.next()];
    expect(seqA).toEqual(seqB);
  });

  it("returns floats in [0, 1)", () => {
    const r = makeRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("differs across seeds", () => {
    expect(makeRng(1).next()).not.toEqual(makeRng(2).next());
  });
});

describe("weightedPick", () => {
  it("respects weight boundaries", () => {
    const items = [
      { k: "a", w: 1 },
      { k: "b", w: 3 }, // total 4: [0,1) -> a, [1,4) -> b
    ];
    const w = (x: { w: number }) => x.w;
    // r = next()*total; 0.1*4=0.4 -> a ; 0.5*4=2.0 -> b ; 0.9*4=3.6 -> b
    expect(weightedPick(items, w, scriptedRng([0.1])).k).toBe("a");
    expect(weightedPick(items, w, scriptedRng([0.5])).k).toBe("b");
    expect(weightedPick(items, w, scriptedRng([0.9])).k).toBe("b");
  });

  it("roughly matches the weight distribution", () => {
    const items = [
      { k: "a", w: 1 },
      { k: "b", w: 9 },
    ];
    const rng = makeRng(123);
    let bCount = 0;
    const N = 10000;
    for (let i = 0; i < N; i++) {
      if (weightedPick(items, (x) => x.w, rng).k === "b") bCount++;
    }
    expect(bCount / N).toBeGreaterThan(0.85);
    expect(bCount / N).toBeLessThan(0.95);
  });

  it("throws on empty or zero-weight input", () => {
    expect(() => weightedPick([], () => 1, makeRng(1))).toThrow();
    expect(() => weightedPick([{ w: 0 }], (x) => x.w, makeRng(1))).toThrow();
  });
});

describe("shuffle", () => {
  it("is a permutation and deterministic per seed", () => {
    const input = [1, 2, 3, 4, 5];
    const a = shuffle(input, makeRng(9));
    const b = shuffle(input, makeRng(9));
    expect(a).toEqual(b);
    expect([...a].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]); // original untouched
  });
});
