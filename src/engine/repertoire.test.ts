import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { blackReplyAt, compileBook } from "./book";
import { buildRepertoireTree, REPERTOIRE_SPECS } from "./repertoire";
import { makeRng } from "./rng";
import { Run } from "./run";

// Compiling validates legality, the single-canonical-reply rule, and transposition
// consistency across every authored line. If this throws, the repertoire has a defect.
const book = compileBook(buildRepertoireTree());

const fenAfterCxd5 = (() => {
  const c = new Chess();
  for (const m of ["e4", "c6", "d4", "d5", "exd5", "cxd5"]) c.move(m);
  return c.fen();
})();

function correct(run: Run): string {
  return blackReplyAt(book, run.view().fen, run.view().tier)!.san;
}

describe("repertoire compiles", () => {
  it("registers all 8 variations", () => {
    expect(book.variations.map((v) => v.id).sort()).toEqual(
      [...REPERTOIRE_SPECS].map((s) => s.id).sort(),
    );
  });

  it("assigns variations to difficulty tiers (the gauntlet's grouping bands)", () => {
    const perTier = (t: number) => book.variations.filter((v) => v.tier === t).length;
    expect(perTier(1)).toBe(2); // advance, exchange
    expect(perTier(2)).toBe(1); // classical
    expect(perTier(3)).toBe(1); // panov
    expect(perTier(4)).toBe(4); // fantasy, reti-nf3, two-knights, sideline-c4
  });
});

describe("perfect play across the full repertoire", () => {
  it("traverses every tier, covers every variation, and wins the run", () => {
    const run = new Run(book, { rng: makeRng(7) });
    const visited = new Set<string>();
    const tiers = new Set<number>();
    let guard = 0;
    while (run.view().status === "awaiting-move") {
      visited.add(run.view().variation!.id);
      tiers.add(run.view().tier);
      run.submit(correct(run));
      if (++guard > 500) throw new Error("run did not terminate");
    }
    expect(run.view().status).toBe("won");
    expect(visited.size).toBe(8);
    expect([...tiers].sort()).toEqual([1, 2, 3, 4]); // every tier was played, in order
  });
});

describe("Exchange does not drift into the Panov (defining-move exclusion)", () => {
  it("c4 is a real option at the shared position but is never played in an Exchange encounter", () => {
    // Sanity: c4 IS present and IS a Panov defining move at the shared position.
    expect(book.white.get(fenAfterCxd5)?.some((o) => o.san === "c4")).toBe(true);
    expect(book.definingMoves.has(`${fenAfterCxd5}|c4`)).toBe(true);

    const whiteFourthMoves = new Set<string>();
    for (let seed = 1; seed <= 80; seed++) {
      const run = new Run(book, { rng: makeRng(seed) });
      if (run.view().variation?.id !== "exchange") continue;
      run.submit("c6");
      run.submit("d5"); // engine forces exd5 -> Black to move
      run.submit("cxd5"); // engine plays White's 4th (weighted, c4 excluded)
      const after = run.view().fen;
      for (const m of new Chess(fenAfterCxd5).moves()) {
        const x = new Chess(fenAfterCxd5);
        x.move(m);
        if (x.fen() === after) whiteFourthMoves.add(m);
      }
    }
    expect(whiteFourthMoves.size).toBeGreaterThan(0); // we did hit Exchange encounters
    expect(whiteFourthMoves.has("c4")).toBe(false); // ...but never the Panov move
  });
});
