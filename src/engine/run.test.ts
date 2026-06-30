import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { blackReplyAt, compileBook } from "./book";
import { FIXTURE_TREE } from "./fixture";
import { makeRng } from "./rng";
import {
  Run,
  RUN_CLEAR_BONUS,
  TIER_CLEAR_BONUS,
  type DecisionEvent,
} from "./run";

const book = compileBook(FIXTURE_TREE);

/** The canonical (correct) Black move at the run's current position. */
function correct(run: Run): string {
  return blackReplyAt(book, run.view().fen, run.view().tier)!.san;
}

/** A legal Black move that is NOT the book move at the given position. */
function wrongMove(fen: string, bookSan: string): string {
  const bookFen = (() => {
    const x = new Chess(fen);
    x.move(bookSan);
    return x.fen();
  })();
  for (const m of new Chess(fen).moves()) {
    const x = new Chess(fen);
    x.move(m);
    if (x.fen() !== bookFen) return m;
  }
  throw new Error("no wrong move available");
}

describe("Run — perfect play traverses every tier", () => {
  it("clears every variation across all tiers and wins the run", () => {
    const run = new Run(book, { rng: makeRng(3) });
    const visited = new Set<string>();
    const tiers = new Set<number>();
    while (run.view().status === "awaiting-move") {
      visited.add(run.view().variation!.id);
      tiers.add(run.view().tier);
      run.submit(correct(run));
    }
    expect(run.view().status).toBe("won");
    expect([...visited].sort()).toEqual(["advance", "classical", "exchange"]);
    expect([...tiers].sort()).toEqual([1, 2]); // both fixture tiers were played
    expect(run.view().hearts).toBe(3); // never lost a heart
    expect(run.view().maxHearts).toBe(3);
  });

  it("signals runWon (with tierCleared) on the final correct move", () => {
    const run = new Run(book, { rng: makeRng(2) });
    let last;
    while (run.view().status === "awaiting-move") last = run.submit(correct(run));
    expect(last).toMatchObject({ type: "correct", runWon: true, tierCleared: true });
  });
});

describe("Run — points economy", () => {
  it("awards +1 per encounter, a tier bonus per tier, and the run-clear bonus", () => {
    const run = new Run(book, { rng: makeRng(3) });
    const corrects: Array<{ encounterCleared: boolean; tierCleared: boolean; runWon: boolean }> = [];
    while (run.view().status === "awaiting-move") {
      const r = run.submit(correct(run));
      if (r.type === "correct") corrects.push(r);
    }
    const encounters = corrects.filter((r) => r.encounterCleared).length;
    const tiers = corrects.filter((r) => r.tierCleared).length;
    const wins = corrects.filter((r) => r.runWon).length;

    expect(encounters).toBe(3); // 3 variations in the fixture
    expect(tiers).toBe(2); // tier 1 boundary + final tier on win
    expect(wins).toBe(1);
    // 3 encounters + 2 tier bonuses + 1 run bonus.
    expect(run.view().points).toBe(3 + 2 * TIER_CLEAR_BONUS + RUN_CLEAR_BONUS);
  });

  it("flags justCrossedTier exactly once at the mid-run tier boundary", () => {
    const run = new Run(book, { rng: makeRng(3) });
    let crossings = 0;
    while (run.view().status === "awaiting-move") {
      run.submit(correct(run));
      if (run.view().justCrossedTier) crossings++;
    }
    expect(crossings).toBe(1); // only the tier1 -> tier2 boundary; the win is not a crossing
  });
});

describe("Run — White is forced down the variation line", () => {
  it("plays the variation's defining move, not a weighted alternative", () => {
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const run = new Run(book, { rng: makeRng(seed) });
      const variation = run.view().variation!.id; // first encounter is always tier 1
      run.submit("c6");
      run.submit("d5");
      const reply = blackReplyAt(book, run.view().fen, run.view().tier)!;
      if (variation === "advance") expect(reply.san).toBe("Bf5");
      else expect(reply.san).toBe("cxd5");
    }
  });
});

describe("Run — mistakes", () => {
  it("costs one heart and reveals the correct move", () => {
    const run = new Run(book, { rng: makeRng(1) });
    const bookMove = correct(run);
    const res = run.submit(wrongMove(run.view().fen, bookMove));
    expect(res).toEqual({
      type: "mistake",
      bookMove,
      idea: expect.any(String),
      heartsLeft: 2,
      dead: false,
      revived: false,
    });
    expect(run.view().revealedMove).toBe(bookMove);
    expect(run.view().hearts).toBe(2);
  });

  it("retry-in-place: a second wrong move at the same position is free", () => {
    const run = new Run(book, { rng: makeRng(1) });
    const fen = run.view().fen;
    const bookMove = correct(run);

    run.submit(wrongMove(fen, bookMove)); // heart 3 -> 2
    const second = run.submit(wrongMove(fen, bookMove)); // already missed -> free
    expect(second).toMatchObject({ heartsLeft: 2 });
    expect(run.view().hearts).toBe(2);

    const ok = run.submit(bookMove);
    expect(ok.type).toBe("correct");
    expect(run.view().fen).not.toBe(fen);
    expect(run.view().revealedMove).toBeNull();
  });

  it("does not penalize an illegal move (input error, not a Mistake)", () => {
    const run = new Run(book, { rng: makeRng(1) });
    const res = run.submit("Qd5"); // illegal at this position
    expect(res).toEqual({ type: "illegal" });
    expect(run.view().hearts).toBe(3);
  });

  it("permadeath: losing all 3 hearts ends the run", () => {
    const run = new Run(book, { rng: makeRng(4) });
    let charged = 0;
    while (run.view().status === "awaiting-move") {
      const fen = run.view().fen;
      const bookMove = correct(run);
      const res = run.submit(wrongMove(fen, bookMove));
      if (res.type === "mistake") {
        charged++;
        if (res.dead) break;
        run.submit(bookMove); // advance to a new position
      }
    }
    expect(charged).toBe(3);
    expect(run.view().status).toBe("dead");
    expect(run.view().hearts).toBe(0);
  });

  it("rejects submitting after the run is over", () => {
    const run = new Run(book, { rng: makeRng(1) });
    while (run.view().status === "awaiting-move") run.submit(correct(run));
    expect(() => run.submit("c6")).toThrow();
  });
});

describe("Run — Tier Heal upgrade", () => {
  it("restores 1 heart (up to max) when a Tier is cleared", () => {
    const run = new Run(book, {
      rng: makeRng(3),
      upgrades: { maxHearts: 4, tierHeal: true },
    });
    // Burn one heart on the first decision, then recover it and play on perfectly.
    const fen0 = run.view().fen;
    const bm0 = correct(run);
    run.submit(wrongMove(fen0, bm0)); // 4 -> 3
    run.submit(bm0);
    expect(run.view().hearts).toBe(3);

    while (run.view().status === "awaiting-move" && !run.view().justCrossedTier) {
      run.submit(correct(run));
    }
    expect(run.view().justCrossedTier).toBe(true);
    expect(run.view().tier).toBe(2);
    expect(run.view().hearts).toBe(4); // 3 + tier heal, back to max
    expect(run.view().tierHealApplied).toBe(true); // Interstitial heal note cue
  });

  it("does not heal beyond max hearts", () => {
    const run = new Run(book, {
      rng: makeRng(3),
      upgrades: { maxHearts: 3, tierHeal: true },
    });
    while (run.view().status === "awaiting-move" && !run.view().justCrossedTier) {
      run.submit(correct(run));
    }
    expect(run.view().justCrossedTier).toBe(true);
    expect(run.view().hearts).toBe(3); // already full, capped
    expect(run.view().tierHealApplied).toBe(false); // no actual heal -> no note
  });
});

describe("Run — Death Defiance upgrade", () => {
  it("revives once with 1 heart on a fatal mistake, then permadeath on the next", () => {
    const run = new Run(book, {
      rng: makeRng(1),
      upgrades: { maxHearts: 1, deathDefiance: true },
    });
    expect(run.view().deathDefianceAvailable).toBe(true);

    const fenA = run.view().fen;
    const bmA = correct(run);
    const r1 = run.submit(wrongMove(fenA, bmA)); // 1 -> 0 -> revived to 1
    expect(r1).toMatchObject({ type: "mistake", dead: false, revived: true, heartsLeft: 1 });
    expect(run.view().status).toBe("awaiting-move");
    expect(run.view().deathDefianceAvailable).toBe(false);

    run.submit(bmA); // correct, move on
    const fenB = run.view().fen;
    const bmB = correct(run);
    const r2 = run.submit(wrongMove(fenB, bmB)); // 1 -> 0, no defiance left -> dead
    expect(r2).toMatchObject({ type: "mistake", dead: true, revived: false });
    expect(run.view().status).toBe("dead");
  });
});

describe("Run — decision events (stats wiring)", () => {
  it("emits one correct event per position faced in a perfect run", () => {
    const events: DecisionEvent[] = [];
    const run = new Run(book, { rng: makeRng(3), onDecision: (e) => events.push(e) });
    let submits = 0;
    while (run.view().status === "awaiting-move") {
      run.submit(correct(run));
      submits++;
    }
    expect(events.length).toBe(submits);
    expect(events.every((e) => e.correct)).toBe(true);
  });

  it("emits exactly one (incorrect) event for a missed-then-corrected position", () => {
    const events: DecisionEvent[] = [];
    const run = new Run(book, { rng: makeRng(1), onDecision: (e) => events.push(e) });
    const fen = run.view().fen;
    const bookMove = correct(run);
    run.submit(wrongMove(fen, bookMove));
    run.submit(wrongMove(fen, bookMove)); // free, no event
    run.submit(bookMove); // corrected, already counted -> no event

    const forThisFen = events.filter((e) => e.fen === fen);
    expect(forThisFen).toEqual([
      { fen, variationId: expect.any(String), correct: false },
    ]);
  });
});
