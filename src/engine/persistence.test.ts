import { describe, it, expect, beforeEach } from "vitest";
import { Chess } from "chess.js";
import {
  awardPoints,
  buyUpgrade,
  effectiveUpgrades,
  freshProgress,
  loadProgress,
  recordDecision,
  saveProgress,
  startRun,
  updateFurthestReach,
  BASE_HEARTS,
  MAX_HEART_LEVELS,
  type KeyValueStore,
} from "./persistence";
import { blackReplyAt, compileBook } from "./book";
import { FIXTURE_TREE } from "./fixture";
import { makeRng } from "./rng";
import { Run } from "./run";

/** In-memory KeyValueStore for tests. */
function memStore(): KeyValueStore & { dump(): Record<string, string> } {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    dump: () => Object.fromEntries(map),
  };
}

describe("progress persistence", () => {
  let store: ReturnType<typeof memStore>;
  beforeEach(() => {
    store = memStore();
  });

  it("returns fresh progress when nothing is stored", () => {
    expect(loadProgress(store)).toEqual({
      points: 0,
      ownedUpgrades: { maxHeartLevel: 0, tierHeal: false, deathDefiance: false },
      furthestReach: { tier: 1, cleared: false },
      runIndex: 0,
      stats: {},
    });
  });

  it("round-trips the new shape through save/load", () => {
    const p = freshProgress();
    startRun(p);
    awardPoints(p, 30);
    buyUpgrade(p, "maxHeart");
    buyUpgrade(p, "tierHeal");
    updateFurthestReach(p, { tier: 3, cleared: false });
    recordDecision(p, { fen: "FEN1", variationId: "advance", correct: false });
    saveProgress(store, p);

    expect(loadProgress(store)).toEqual(p);
  });

  it("recovers from a corrupt store instead of throwing", () => {
    store.setItem("ckrt.progress.v2", "{not json");
    expect(loadProgress(store)).toEqual(freshProgress());
  });
});

describe("startRun", () => {
  it("increments the run index monotonically", () => {
    const p = freshProgress();
    expect(startRun(p)).toBe(1);
    expect(startRun(p)).toBe(2);
    expect(p.runIndex).toBe(2);
  });
});

describe("recordDecision", () => {
  it("accumulates seen and mistakes and stamps the run index", () => {
    const p = freshProgress();
    startRun(p); // runIndex = 1
    const e = { fen: "F", variationId: "advance", correct: false } as const;
    recordDecision(p, e);
    recordDecision(p, { ...e, correct: true });
    expect(p.stats["F"]).toEqual({ seen: 2, mistakes: 1, lastSeenRunIndex: 1 });
  });
});

describe("awardPoints", () => {
  it("banks points into the wallet", () => {
    const p = freshProgress();
    expect(awardPoints(p, 7)).toBe(7);
    expect(awardPoints(p, 5)).toBe(12);
    expect(p.points).toBe(12);
  });
});

describe("buyUpgrade", () => {
  it("buys +1 Max Heart up to the cap, deducting scaling cost", () => {
    const p = freshProgress();
    awardPoints(p, 100);
    let bought = 0;
    while (buyUpgrade(p, "maxHeart")) bought++;
    expect(bought).toBe(MAX_HEART_LEVELS);
    expect(p.ownedUpgrades.maxHeartLevel).toBe(MAX_HEART_LEVELS);
    expect(buyUpgrade(p, "maxHeart")).toBe(false); // capped
  });

  it("refuses a purchase the wallet cannot afford and leaves progress untouched", () => {
    const p = freshProgress(); // 0 points
    expect(buyUpgrade(p, "tierHeal")).toBe(false);
    expect(p.ownedUpgrades.tierHeal).toBe(false);
    expect(p.points).toBe(0);
  });

  it("buys one-shot upgrades once and deducts their cost", () => {
    const p = freshProgress();
    awardPoints(p, 50);
    const before = p.points;
    expect(buyUpgrade(p, "deathDefiance")).toBe(true);
    expect(p.ownedUpgrades.deathDefiance).toBe(true);
    expect(p.points).toBeLessThan(before);
    expect(buyUpgrade(p, "deathDefiance")).toBe(false); // already owned
  });
});

describe("effectiveUpgrades", () => {
  it("derives the per-run inputs from owned upgrades", () => {
    const p = freshProgress();
    expect(effectiveUpgrades(p)).toEqual({
      maxHearts: BASE_HEARTS,
      tierHeal: false,
      deathDefiance: false,
    });

    awardPoints(p, 100);
    buyUpgrade(p, "maxHeart");
    buyUpgrade(p, "tierHeal");
    buyUpgrade(p, "deathDefiance");
    expect(effectiveUpgrades(p)).toEqual({
      maxHearts: BASE_HEARTS + 1,
      tierHeal: true,
      deathDefiance: true,
    });
  });
});

describe("effectiveUpgrades flows into a Run", () => {
  const book = compileBook(FIXTURE_TREE);

  /** A legal Black move that is NOT the book move at `fen`. */
  function wrongMove(fen: string, bookSan: string): string {
    const after = new Chess(fen);
    after.move(bookSan);
    const bookFen = after.fen();
    for (const m of new Chess(fen).moves()) {
      const x = new Chess(fen);
      x.move(m);
      if (x.fen() !== bookFen) return m;
    }
    throw new Error("no wrong move available");
  }

  it("a Run built from purchased upgrades reflects every bought upgrade", () => {
    const p = freshProgress();
    awardPoints(p, 100);
    buyUpgrade(p, "maxHeart"); // base 3 + 1 = 4
    buyUpgrade(p, "tierHeal");
    buyUpgrade(p, "deathDefiance");

    const run = new Run(book, { rng: makeRng(3), upgrades: effectiveUpgrades(p) });
    // +1 Max Heart and Death Defiance show up immediately in the run view.
    expect(run.view().maxHearts).toBe(BASE_HEARTS + 1);
    expect(run.view().deathDefianceAvailable).toBe(true);

    // Tier Heal: burn a heart, then clear the first Tier — the boundary heals it back.
    const fen0 = run.view().fen;
    const book0 = blackReplyAt(book, fen0, run.view().tier)!.san;
    run.submit(wrongMove(fen0, book0)); // 4 -> 3
    run.submit(book0); // correct, retry-in-place
    while (run.view().status === "awaiting-move" && !run.view().justCrossedTier) {
      run.submit(blackReplyAt(book, run.view().fen, run.view().tier)!.san);
    }
    expect(run.view().justCrossedTier).toBe(true);
    expect(run.view().hearts).toBe(4); // healed back to max at the Tier boundary
    expect(run.view().tierHealApplied).toBe(true);
  });
});

describe("updateFurthestReach", () => {
  it("tracks the deepest tier and the cleared flag, never regressing", () => {
    const p = freshProgress();
    updateFurthestReach(p, { tier: 3, cleared: false });
    expect(p.furthestReach).toEqual({ tier: 3, cleared: false });

    updateFurthestReach(p, { tier: 2, cleared: true }); // shallower tier, but cleared
    expect(p.furthestReach).toEqual({ tier: 3, cleared: true });

    updateFurthestReach(p, { tier: 1, cleared: false }); // never regresses
    expect(p.furthestReach).toEqual({ tier: 3, cleared: true });
  });
});
