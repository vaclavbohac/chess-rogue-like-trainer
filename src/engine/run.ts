import { blackReplyAt, tryMove, whiteOptionsAt, type MoveInput } from "./book";
import { buildGauntlet } from "./gauntlet";
import { weightedPick, type Rng } from "./rng";
import type { CompiledBook, Fen, San, VariationDef } from "./types";
import { venueName } from "./venues";

export const DEFAULT_HEARTS = 3;

/** Points awarded for clearing a whole Tier (on top of the per-encounter +1). */
export const TIER_CLEAR_BONUS = 5;
/** Points awarded for clearing the whole Run (reaching the final). */
export const RUN_CLEAR_BONUS = 15;

export type RunStatus = "awaiting-move" | "won" | "dead";

export interface DecisionEvent {
  fen: Fen;
  variationId: string;
  correct: boolean;
}

/** Per-run effects of permanent Upgrades (derived from persistence). */
export interface RunUpgrades {
  /** Total heart pool for the run (defaults to DEFAULT_HEARTS). */
  maxHearts?: number;
  /** +1 heart (up to max) each time a Tier is cleared. */
  tierHeal?: boolean;
  /** Once per run, survive a fatal mistake with 1 heart. */
  deathDefiance?: boolean;
}

export interface RunOptions {
  rng: Rng;
  upgrades?: RunUpgrades;
  /** Called once per *charged* decision (first attempt at a position). */
  onDecision?: (e: DecisionEvent) => void;
}

/** What the UI needs to render the current state. */
export interface RunView {
  status: RunStatus;
  /** Current Tier number and its Venue label. */
  tier: number;
  venue: string;
  hearts: number;
  maxHearts: number;
  /** 1-based index of the current encounter within the whole gauntlet. */
  encounterNumber: number;
  gauntletSize: number;
  /** 1-based index of the current encounter within the current Tier. */
  tierEncounterNumber: number;
  tierEncounterCount: number;
  variation: VariationDef | null;
  fen: Fen;
  /** Set after a mistake at the current position (retry-in-place reveal). */
  revealedMove: San | null;
  revealedIdea: string | null;
  /** Points earned so far in this run. */
  points: number;
  deathDefianceAvailable: boolean;
  /**
   * True for exactly the window between crossing into a new Tier and the player's
   * next move — the UI's cue to show the between-Tier Interstitial. Never set after
   * the final Tier (that is a run win, shown as a summary instead).
   */
  justCrossedTier: boolean;
  /**
   * True alongside `justCrossedTier` when the Tier Heal upgrade actually restored a
   * heart at this boundary (i.e. it wasn't already full) — the Interstitial's cue to
   * show the heal note. Cleared together with `justCrossedTier` on the next move.
   */
  tierHealApplied: boolean;
}

export type SubmitResult =
  | { type: "illegal" }
  | {
      type: "mistake";
      bookMove: San;
      idea: string;
      heartsLeft: number;
      dead: boolean;
      /** Death Defiance just saved the run from this otherwise-fatal mistake. */
      revived: boolean;
    }
  | {
      type: "correct";
      idea: string;
      encounterCleared: boolean;
      tierCleared: boolean;
      runWon: boolean;
    };

/**
 * Drives one Run: the full Gauntlet (all variations, grouped by Tier ascending),
 * traversed on one shared heart pool. The player only ever acts on Black-to-move
 * positions; White replies are auto-played (forced along the encounter's variation
 * line, then weighted-random). See CONTEXT.md / ADR-0003.
 */
export class Run {
  private readonly book: CompiledBook;
  private readonly rng: Rng;
  private readonly onDecision?: (e: DecisionEvent) => void;

  private readonly gauntlet: VariationDef[];
  private readonly maxHearts: number;
  private readonly tierHeal: boolean;

  private hearts: number;
  private deathDefianceAvailable: boolean;
  private points = 0;
  private encounterIndex = 0;
  private status: RunStatus = "awaiting-move";
  private justCrossedTier = false;
  private tierHealApplied = false;

  private fen: Fen;
  private whiteMovesPlayed = 0;
  /** Positions already missed in the current encounter (so a re-miss is free). */
  private missed = new Set<Fen>();
  private revealedMove: San | null = null;
  private revealedIdea: string | null = null;

  constructor(book: CompiledBook, opts: RunOptions) {
    this.book = book;
    this.rng = opts.rng;
    this.onDecision = opts.onDecision;
    this.maxHearts = opts.upgrades?.maxHearts ?? DEFAULT_HEARTS;
    this.tierHeal = opts.upgrades?.tierHeal ?? false;
    this.deathDefianceAvailable = opts.upgrades?.deathDefiance ?? false;
    this.hearts = this.maxHearts;
    this.gauntlet = buildGauntlet(book, opts.rng);
    this.fen = book.startFen;
    if (this.gauntlet.length === 0) {
      this.status = "won"; // empty book -> trivially won
    } else {
      this.beginEncounter();
    }
  }

  private get variation(): VariationDef | null {
    return this.gauntlet[this.encounterIndex] ?? null;
  }

  /** The book is looked up at the current encounter's tier (all tiers are present). */
  private get bookTier(): number {
    return this.variation?.tier ?? this.gauntlet[this.gauntlet.length - 1]?.tier ?? 1;
  }

  private beginEncounter(): void {
    this.fen = this.book.startFen;
    this.whiteMovesPlayed = 0;
    this.missed.clear();
    this.revealedMove = null;
    this.revealedIdea = null;
    this.advanceWhite();
  }

  /**
   * Play one White move (forced along the variation line, else weighted-random),
   * landing on a Black-to-move position — or clear the encounter if out of book.
   */
  private advanceWhite(): void {
    const variation = this.variation;
    if (!variation) return;

    const options = whiteOptionsAt(this.book, this.fen, this.bookTier);
    if (options.length === 0) {
      this.clearEncounter();
      return;
    }

    const forced = this.book.variationLine.get(variation.id) ?? [];
    let san: San;
    if (this.whiteMovesPlayed < forced.length) {
      san = forced[this.whiteMovesPlayed]!;
    } else {
      // Past our forced line: never wander into another variation's defining move
      // (those are reached only via their own encounter — coverage guarantee).
      const pickable = options.filter(
        (o) => !this.book.definingMoves.has(`${this.fen}|${o.san}`),
      );
      if (pickable.length === 0) {
        this.clearEncounter(); // only foreign branches remain -> out of book here
        return;
      }
      san = weightedPick(pickable, (o) => o.weight, this.rng).san;
    }

    const applied = tryMove(this.fen, san);
    if (!applied) {
      const how =
        this.whiteMovesPlayed < forced.length ? "forced" : "weighted-random";
      throw new Error(
        `Book bug: ${how} White move "${san}" (variation "${variation.id}") ` +
          `is illegal at ${this.fen}`,
      );
    }
    this.fen = applied.fen;
    this.whiteMovesPlayed++;

    // Now Black to move. If out of book, the encounter is cleared.
    if (!blackReplyAt(this.book, this.fen, this.bookTier)) {
      this.clearEncounter();
    }
  }

  /** Whether the current encounter is the last one of its Tier in the gauntlet. */
  private isLastEncounterOfTier(): boolean {
    const cur = this.gauntlet[this.encounterIndex];
    if (!cur) return false;
    const next = this.gauntlet[this.encounterIndex + 1];
    return !next || next.tier !== cur.tier;
  }

  private clearEncounter(): void {
    this.points += 1; // +1 per Encounter cleared
    const lastOfTier = this.isLastEncounterOfTier();
    const lastEncounter = this.encounterIndex === this.gauntlet.length - 1;

    if (lastOfTier) this.points += TIER_CLEAR_BONUS;

    if (lastEncounter) {
      this.points += RUN_CLEAR_BONUS; // reached the final
      this.encounterIndex++;
      this.status = "won";
      return;
    }

    this.encounterIndex++;
    if (lastOfTier) {
      // Crossing into the next Tier: heal (if owned) and flag the Interstitial.
      if (this.tierHeal) {
        const before = this.hearts;
        this.hearts = Math.min(this.hearts + 1, this.maxHearts);
        this.tierHealApplied = this.hearts > before; // only note an actual heal
      }
      this.justCrossedTier = true;
    }
    this.beginEncounter();
  }

  /** Submit the player's Black move at the current position. */
  submit(input: MoveInput): SubmitResult {
    if (this.status !== "awaiting-move") {
      throw new Error(`Cannot submit while status is "${this.status}"`);
    }
    // A move acknowledges any just-crossed Tier (the Interstitial is dismissed).
    this.justCrossedTier = false;
    this.tierHealApplied = false;

    const reply = blackReplyAt(this.book, this.fen, this.bookTier);
    if (!reply) {
      // Should not happen: we only rest on in-book Black positions.
      throw new Error(`No book reply at ${this.fen}`);
    }

    const attempt = tryMove(this.fen, input);
    if (!attempt) {
      return { type: "illegal" }; // input error, not a Mistake
    }

    const bookApplied = tryMove(this.fen, reply.san)!;
    const correct = attempt.fen === bookApplied.fen;

    if (correct) {
      // Count a clean first-time-correct as "seen". A position corrected after a
      // miss was already counted at the miss, so don't double-count it.
      if (!this.missed.has(this.fen)) {
        this.onDecision?.({
          fen: this.fen,
          variationId: this.variation?.id ?? "",
          correct: true,
        });
      }
      const encounterBefore = this.encounterIndex;
      const tierBefore = this.variation?.tier;
      this.fen = bookApplied.fen;
      this.revealedMove = null;
      this.revealedIdea = null;
      this.advanceWhite();
      const runWon = this.encounterIndex >= this.gauntlet.length;
      const encounterCleared = runWon || this.encounterIndex !== encounterBefore;
      const tierCleared =
        runWon || (encounterCleared && this.variation?.tier !== tierBefore);
      return { type: "correct", idea: reply.idea, encounterCleared, tierCleared, runWon };
    }

    // Mistake: charge a heart only the first time this position is missed (Q3 invariant).
    const firstMiss = !this.missed.has(this.fen);
    let revived = false;
    if (firstMiss) {
      this.missed.add(this.fen);
      this.hearts--;
      this.onDecision?.({
        fen: this.fen,
        variationId: this.variation?.id ?? "",
        correct: false,
      });
      // Death Defiance: a fatal mistake revives once with 1 heart instead of ending.
      if (this.hearts <= 0 && this.deathDefianceAvailable) {
        this.deathDefianceAvailable = false;
        this.hearts = 1;
        revived = true;
      }
    }
    this.revealedMove = reply.san;
    this.revealedIdea = reply.idea;

    const dead = this.hearts <= 0;
    if (dead) this.status = "dead";

    return {
      type: "mistake",
      bookMove: reply.san,
      idea: reply.idea,
      heartsLeft: Math.max(0, this.hearts),
      dead,
      revived,
    };
  }

  /** Position of the current encounter within its Tier (1-based) and tier size. */
  private tierProgress(): { tier: number; number: number; count: number } {
    if (this.gauntlet.length === 0) return { tier: 1, number: 0, count: 0 };
    const idx = Math.min(this.encounterIndex, this.gauntlet.length - 1);
    const tier = this.gauntlet[idx]!.tier;
    const count = this.gauntlet.filter((v) => v.tier === tier).length;
    let number = 0;
    for (let i = 0; i <= idx; i++) if (this.gauntlet[i]!.tier === tier) number++;
    return { tier, number, count };
  }

  view(): RunView {
    const tp = this.tierProgress();
    return {
      status: this.status,
      tier: tp.tier,
      venue: venueName(tp.tier),
      hearts: Math.max(0, this.hearts),
      maxHearts: this.maxHearts,
      encounterNumber: Math.min(this.encounterIndex + 1, this.gauntlet.length),
      gauntletSize: this.gauntlet.length,
      tierEncounterNumber: tp.number,
      tierEncounterCount: tp.count,
      variation: this.variation,
      fen: this.fen,
      revealedMove: this.revealedMove,
      revealedIdea: this.revealedIdea,
      points: this.points,
      deathDefianceAvailable: this.deathDefianceAvailable,
      justCrossedTier: this.justCrossedTier,
      tierHealApplied: this.tierHealApplied,
    };
  }
}
