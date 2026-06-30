import { describe, it, expect, beforeEach } from "vitest";
import {
  freshProgress,
  loadProgress,
  recordDecision,
  saveProgress,
  startRun,
  unlockNextTier,
  type KeyValueStore,
} from "./persistence";

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
    expect(loadProgress(store)).toEqual({ tier: 1, runIndex: 0, stats: {} });
  });

  it("round-trips through save/load", () => {
    const p = freshProgress();
    startRun(p);
    unlockNextTier(p, 4);
    recordDecision(p, { fen: "FEN1", variationId: "advance", correct: false });
    saveProgress(store, p);

    expect(loadProgress(store)).toEqual(p);
  });

  it("recovers from a corrupt store instead of throwing", () => {
    store.setItem("ckrt.progress.v1", "{not json");
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

describe("unlockNextTier", () => {
  it("advances up to the max tier and then stops", () => {
    const p = freshProgress();
    expect(unlockNextTier(p, 2)).toBe(2);
    expect(unlockNextTier(p, 2)).toBe(2); // capped
  });
});
