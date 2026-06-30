import { blackReplyAt, tryMove, whiteOptionsAt, type MoveInput } from "./book";
import { buildGauntlet } from "./gauntlet";
import { weightedPick, type Rng } from "./rng";
import type { CompiledBook, Fen, San, VariationDef } from "./types";

export const DEFAULT_HEARTS = 3;

export type RunStatus = "awaiting-move" | "won" | "dead";

export interface DecisionEvent {
  fen: Fen;
  variationId: string;
  correct: boolean;
}

export interface RunOptions {
  tier: number;
  rng: Rng;
  hearts?: number;
  /** Called once per *charged* decision (first attempt at a position). */
  onDecision?: (e: DecisionEvent) => void;
}

/** What the UI needs to render the current state. */
export interface RunView {
  status: RunStatus;
  tier: number;
  hearts: number;
  /** 1-based index of the current encounter within the gauntlet. */
  encounterNumber: number;
  gauntletSize: number;
  variation: VariationDef | null;
  fen: Fen;
  /** Set after a mistake at the current position (retry-in-place reveal). */
  revealedMove: San | null;
  revealedIdea: string | null;
}

export type SubmitResult =
  | { type: "illegal" }
  | {
      type: "mistake";
      bookMove: San;
      idea: string;
      heartsLeft: number;
      dead: boolean;
    }
  | {
      type: "correct";
      idea: string;
      encounterCleared: boolean;
      runWon: boolean;
    };

/**
 * Drives one Run: a gauntlet of encounters sharing a heart pool. The player only
 * ever acts on Black-to-move positions; White replies are auto-played (forced along
 * the encounter's variation line, then weighted-random). See SPEC.md §2/§3.
 */
export class Run {
  private readonly book: CompiledBook;
  private readonly rng: Rng;
  private readonly onDecision?: (e: DecisionEvent) => void;

  readonly tier: number;
  private readonly gauntlet: VariationDef[];

  private hearts: number;
  private encounterIndex = 0;
  private status: RunStatus = "awaiting-move";

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
    this.tier = opts.tier;
    this.hearts = opts.hearts ?? DEFAULT_HEARTS;
    this.gauntlet = buildGauntlet(book, opts.tier, opts.rng);
    this.fen = book.startFen;
    if (this.gauntlet.length === 0) {
      // Nothing unlocked -> trivially won.
      this.status = "won";
    } else {
      this.beginEncounter();
    }
  }

  private get variation(): VariationDef | null {
    return this.gauntlet[this.encounterIndex] ?? null;
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

    const options = whiteOptionsAt(this.book, this.fen, this.tier);
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
    if (!blackReplyAt(this.book, this.fen, this.tier)) {
      this.clearEncounter();
    }
  }

  private clearEncounter(): void {
    this.encounterIndex++;
    if (this.encounterIndex >= this.gauntlet.length) {
      this.status = "won";
    } else {
      this.beginEncounter();
    }
  }

  /** Submit the player's Black move at the current position. */
  submit(input: MoveInput): SubmitResult {
    if (this.status !== "awaiting-move") {
      throw new Error(`Cannot submit while status is "${this.status}"`);
    }
    const reply = blackReplyAt(this.book, this.fen, this.tier);
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
      this.fen = bookApplied.fen;
      this.revealedMove = null;
      this.revealedIdea = null;
      this.advanceWhite();
      const runWon = this.encounterIndex >= this.gauntlet.length;
      const encounterCleared = runWon || this.encounterIndex !== encounterBefore;
      return { type: "correct", idea: reply.idea, encounterCleared, runWon };
    }

    // Mistake: charge a heart only the first time this position is missed (Q3 invariant).
    const firstMiss = !this.missed.has(this.fen);
    if (firstMiss) {
      this.missed.add(this.fen);
      this.hearts--;
      this.onDecision?.({
        fen: this.fen,
        variationId: this.variation?.id ?? "",
        correct: false,
      });
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
    };
  }

  view(): RunView {
    return {
      status: this.status,
      tier: this.tier,
      hearts: Math.max(0, this.hearts),
      encounterNumber: Math.min(this.encounterIndex + 1, this.gauntlet.length),
      gauntletSize: this.gauntlet.length,
      variation: this.variation,
      fen: this.fen,
      revealedMove: this.revealedMove,
      revealedIdea: this.revealedIdea,
    };
  }
}
