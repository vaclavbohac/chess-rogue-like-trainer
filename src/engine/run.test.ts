import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { blackReplyAt, compileBook } from "./book";
import { FIXTURE_TREE } from "./fixture";
import { makeRng } from "./rng";
import { Run, type DecisionEvent } from "./run";

const book = compileBook(FIXTURE_TREE);

/** The canonical (correct) Black move at the run's current position. */
function correct(run: Run): string {
  return blackReplyAt(book, run.view().fen, run.tier)!.san;
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

describe("Run — perfect play", () => {
  it("clears every Tier-1 variation and wins the run", () => {
    const run = new Run(book, { tier: 1, rng: makeRng(3) });
    const visited = new Set<string>();
    while (run.view().status === "awaiting-move") {
      visited.add(run.view().variation!.id);
      run.submit(correct(run));
    }
    expect(run.view().status).toBe("won");
    expect([...visited].sort()).toEqual(["advance", "exchange"]);
    expect(run.view().hearts).toBe(3); // never lost a heart
  });

  it("includes the Classical variation at Tier 2", () => {
    const run = new Run(book, { tier: 2, rng: makeRng(8) });
    const visited = new Set<string>();
    while (run.view().status === "awaiting-move") {
      visited.add(run.view().variation!.id);
      run.submit(correct(run));
    }
    expect(run.view().status).toBe("won");
    expect([...visited].sort()).toEqual(["advance", "classical", "exchange"]);
  });

  it("signals runWon on the final correct move", () => {
    const run = new Run(book, { tier: 1, rng: makeRng(2) });
    let last;
    while (run.view().status === "awaiting-move") {
      last = run.submit(correct(run));
    }
    expect(last).toMatchObject({ type: "correct", runWon: true });
  });
});

describe("Run — White is forced down the variation line", () => {
  it("plays the variation's defining move, not a weighted alternative", () => {
    // Whatever the first encounter is, White must reach that exact variation.
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const run = new Run(book, { tier: 1, rng: makeRng(seed) });
      const variation = run.view().variation!.id;
      run.submit("c6");
      run.submit("d5");
      const reply = blackReplyAt(book, run.view().fen, 1)!;
      if (variation === "advance") expect(reply.san).toBe("Bf5");
      else expect(reply.san).toBe("cxd5");
    }
  });
});

describe("Run — mistakes", () => {
  it("costs one heart and reveals the correct move", () => {
    const run = new Run(book, { tier: 1, rng: makeRng(1) });
    const bookMove = correct(run);
    const res = run.submit(wrongMove(run.view().fen, bookMove));
    expect(res).toEqual({
      type: "mistake",
      bookMove,
      idea: expect.any(String),
      heartsLeft: 2,
      dead: false,
    });
    expect(run.view().revealedMove).toBe(bookMove);
    expect(run.view().hearts).toBe(2);
  });

  it("retry-in-place: a second wrong move at the same position is free", () => {
    const run = new Run(book, { tier: 1, rng: makeRng(1) });
    const fen = run.view().fen;
    const bookMove = correct(run);

    run.submit(wrongMove(fen, bookMove)); // heart 3 -> 2
    const second = run.submit(wrongMove(fen, bookMove)); // already missed -> free
    expect(second).toMatchObject({ heartsLeft: 2 });
    expect(run.view().hearts).toBe(2);

    // Playing the correct move now advances past the position.
    const ok = run.submit(bookMove);
    expect(ok.type).toBe("correct");
    expect(run.view().fen).not.toBe(fen);
    expect(run.view().revealedMove).toBeNull();
  });

  it("does not penalize an illegal move (input error, not a Mistake)", () => {
    const run = new Run(book, { tier: 1, rng: makeRng(1) });
    const res = run.submit("Qd5"); // illegal at this position
    expect(res).toEqual({ type: "illegal" });
    expect(run.view().hearts).toBe(3);
  });

  it("permadeath: losing all 3 hearts ends the run", () => {
    const run = new Run(book, { tier: 2, rng: makeRng(4) });
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
    const run = new Run(book, { tier: 1, rng: makeRng(1) });
    while (run.view().status === "awaiting-move") run.submit(correct(run));
    expect(() => run.submit("c6")).toThrow();
  });
});

describe("Run — decision events (stats wiring)", () => {
  it("emits one correct event per position faced in a perfect run", () => {
    const events: DecisionEvent[] = [];
    const run = new Run(book, {
      tier: 1,
      rng: makeRng(3),
      onDecision: (e) => events.push(e),
    });
    while (run.view().status === "awaiting-move") run.submit(correct(run));

    // 2 encounters x 4 Black decisions each = 8.
    expect(events.length).toBe(8);
    expect(events.every((e) => e.correct)).toBe(true);
  });

  it("emits exactly one (incorrect) event for a missed-then-corrected position", () => {
    const events: DecisionEvent[] = [];
    const run = new Run(book, {
      tier: 1,
      rng: makeRng(1),
      onDecision: (e) => events.push(e),
    });
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
