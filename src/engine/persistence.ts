import type { RunUpgrades } from "./run";
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

/** Permanent, purchased modifiers (the Shop's stock). See the upgrade catalog below. */
export interface OwnedUpgrades {
  /** Levels of +1 Max Heart bought (0 = base hearts). Capped at MAX_HEART_LEVELS. */
  maxHeartLevel: number;
  tierHeal: boolean;
  deathDefiance: boolean;
}

/** High-water mark of meta-progression (replaces the old tier-unlock state). */
export interface FurthestReach {
  /** Deepest Tier reached across all runs. */
  tier: number;
  /** Whether the final Tier has ever been cleared ("reached the final"). */
  cleared: boolean;
}

export interface Progress {
  /** Banked currency wallet, spent in the Shop. */
  points: number;
  ownedUpgrades: OwnedUpgrades;
  furthestReach: FurthestReach;
  /** Monotonic count of runs started; stamps `lastSeenRunIndex`. */
  runIndex: number;
  /** Per-position history, keyed by FEN. */
  stats: Record<Fen, PositionStat>;
}

// ---------------------------------------------------------------------------
// Upgrade catalog — single source of truth the Shop UI imports.
// ---------------------------------------------------------------------------

export const BASE_HEARTS = 3;
/** Cap for the heart pool (~6): base 3 + 3 purchasable levels. */
export const MAX_HEART_CAP = 6;
export const MAX_HEART_LEVELS = MAX_HEART_CAP - BASE_HEARTS;

export type UpgradeId = "maxHeart" | "tierHeal" | "deathDefiance";

export interface UpgradeCatalogEntry {
  id: UpgradeId;
  name: string;
  description: string;
  /** Cost to buy the next step, or null if already maxed/owned for this `owned` state. */
  cost(owned: OwnedUpgrades): number | null;
  /** Whether another purchase is possible from this `owned` state. */
  available(owned: OwnedUpgrades): boolean;
}

/** +1 Max Heart scales with how many you already own (base 3, +2 per level). */
function maxHeartCost(level: number): number {
  return 3 + 2 * level;
}

export const UPGRADE_CATALOG: UpgradeCatalogEntry[] = [
  {
    id: "maxHeart",
    name: "+1 Max Heart",
    description: "Raise your maximum hearts by one (repeatable, scaling cost).",
    cost: (o) => (o.maxHeartLevel < MAX_HEART_LEVELS ? maxHeartCost(o.maxHeartLevel) : null),
    available: (o) => o.maxHeartLevel < MAX_HEART_LEVELS,
  },
  {
    id: "tierHeal",
    name: "Tier Heal",
    description: "Regain 1 heart (up to max) each time you clear a Tier.",
    cost: (o) => (o.tierHeal ? null : 10),
    available: (o) => !o.tierHeal,
  },
  {
    id: "deathDefiance",
    name: "Death Defiance",
    description: "Once per run, survive a fatal mistake with 1 heart.",
    cost: (o) => (o.deathDefiance ? null : 12),
    available: (o) => !o.deathDefiance,
  },
];

export function upgradeById(id: UpgradeId): UpgradeCatalogEntry {
  const entry = UPGRADE_CATALOG.find((u) => u.id === id);
  if (!entry) throw new Error(`Unknown upgrade id: ${id}`);
  return entry;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const STORAGE_KEY = "ckrt.progress.v2";

export function freshProgress(): Progress {
  return {
    points: 0,
    ownedUpgrades: { maxHeartLevel: 0, tierHeal: false, deathDefiance: false },
    furthestReach: { tier: 1, cleared: false },
    runIndex: 0,
    stats: {},
  };
}

export function loadProgress(store: KeyValueStore): Progress {
  const raw = store.getItem(STORAGE_KEY);
  if (!raw) return freshProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const fresh = freshProgress();
    return {
      points: parsed.points ?? fresh.points,
      ownedUpgrades: {
        maxHeartLevel: parsed.ownedUpgrades?.maxHeartLevel ?? 0,
        tierHeal: parsed.ownedUpgrades?.tierHeal ?? false,
        deathDefiance: parsed.ownedUpgrades?.deathDefiance ?? false,
      },
      furthestReach: {
        tier: parsed.furthestReach?.tier ?? fresh.furthestReach.tier,
        cleared: parsed.furthestReach?.cleared ?? false,
      },
      runIndex: parsed.runIndex ?? fresh.runIndex,
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

// ---------------------------------------------------------------------------
// Meta-economy helpers
// ---------------------------------------------------------------------------

/** Bank points into the wallet (call with the points earned in a finished run). */
export function awardPoints(progress: Progress, points: number): number {
  progress.points += Math.max(0, points);
  return progress.points;
}

/** Translate owned permanent upgrades into the per-run inputs the Run engine needs. */
export function effectiveUpgrades(progress: Progress): RunUpgrades {
  const { ownedUpgrades: u } = progress;
  return {
    maxHearts: BASE_HEARTS + u.maxHeartLevel,
    tierHeal: u.tierHeal,
    deathDefiance: u.deathDefiance,
  };
}

/**
 * Buy an upgrade: validate it is available and affordable, then deduct points and
 * apply it. Returns true on success; leaves `progress` untouched on failure.
 */
export function buyUpgrade(progress: Progress, id: UpgradeId): boolean {
  const entry = upgradeById(id);
  const owned = progress.ownedUpgrades;
  if (!entry.available(owned)) return false;
  const cost = entry.cost(owned);
  if (cost == null || progress.points < cost) return false;

  progress.points -= cost;
  switch (id) {
    case "maxHeart":
      owned.maxHeartLevel += 1;
      break;
    case "tierHeal":
      owned.tierHeal = true;
      break;
    case "deathDefiance":
      owned.deathDefiance = true;
      break;
  }
  return true;
}

/** Advance the furthest-reach high-water mark after a run (never regresses). */
export function updateFurthestReach(
  progress: Progress,
  reach: { tier: number; cleared: boolean },
): FurthestReach {
  const fr = progress.furthestReach;
  fr.tier = Math.max(fr.tier, reach.tier);
  fr.cleared = fr.cleared || reach.cleared;
  return fr;
}
