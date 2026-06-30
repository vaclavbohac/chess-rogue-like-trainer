import type { DecisionEvent } from "./run";
import type { Fen } from "./types";

/**
 * Minimal storage interface so progress logic is testable without a browser.
 * In the app this is backed by window.localStorage; in tests, a plain object.
 */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface PositionStat {
  seen: number;
  mistakes: number;
  lastSeenRunIndex: number;
}

export interface Progress {
  /** Highest unlocked Tier (1 = start). */
  tier: number;
  /** Monotonic count of runs started; stamps `lastSeenRunIndex`. */
  runIndex: number;
  /** Per-position history, keyed by FEN. */
  stats: Record<Fen, PositionStat>;
}

const STORAGE_KEY = "ckrt.progress.v1";

export function freshProgress(): Progress {
  return { tier: 1, runIndex: 0, stats: {} };
}

export function loadProgress(store: KeyValueStore): Progress {
  const raw = store.getItem(STORAGE_KEY);
  if (!raw) return freshProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      tier: parsed.tier ?? 1,
      runIndex: parsed.runIndex ?? 0,
      stats: parsed.stats ?? {},
    };
  } catch {
    // Corrupt store: start clean rather than crash on a flight.
    return freshProgress();
  }
}

export function saveProgress(store: KeyValueStore, progress: Progress): void {
  store.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/** Bump the run counter (call when a new Run starts). Returns the new index. */
export function startRun(progress: Progress): number {
  progress.runIndex += 1;
  return progress.runIndex;
}

/** Fold a Run decision event into the stats (wire to Run's onDecision). */
export function recordDecision(progress: Progress, e: DecisionEvent): void {
  const stat = progress.stats[e.fen] ?? {
    seen: 0,
    mistakes: 0,
    lastSeenRunIndex: 0,
  };
  stat.seen += 1;
  if (!e.correct) stat.mistakes += 1;
  stat.lastSeenRunIndex = progress.runIndex;
  progress.stats[e.fen] = stat;
}

/** Unlock the next Tier after a Run is won. Returns the (possibly raised) tier. */
export function unlockNextTier(progress: Progress, maxTier: number): number {
  if (progress.tier < maxTier) progress.tier += 1;
  return progress.tier;
}
