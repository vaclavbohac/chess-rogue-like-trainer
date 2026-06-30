/** Domain types for the Caro-Kann roguelike trainer. See SPEC.md / CONTEXT.md. */

export type San = string; // e.g. "Nf6", "exd5", "O-O"
export type Fen = string; // full FEN string

/** A named opening variation (Advance, Exchange, Classical, Panov, ...). */
export interface VariationDef {
  id: string;
  name: string;
  /** The Tier at which this variation unlocks (1 = available from the start). */
  tier: number;
}

// ---------------------------------------------------------------------------
// Authoring format: a human-writable move tree, compiled to the runtime Book.
// ---------------------------------------------------------------------------

/**
 * One move in the authored tree, given in SAN for the position *before* it is
 * played. White nodes may carry a `weight` and `variation` tag; Black nodes carry
 * the `idea`. A node with no `children` is a leaf (out of book at its tier).
 */
export interface MoveNode {
  move: San;
  /** White move only: relative frequency for weighted-random selection. Default 1. */
  weight?: number;
  /** Black move only: the one-line idea shown as feedback. */
  idea?: string;
  /**
   * Tag marking this (White) move as the defining move of a variation. The path of
   * White moves from the root to here becomes the variation's forced line.
   */
  variation?: VariationDef;
  /**
   * The Tier at which this move (and its subtree) becomes active. Defaults to the
   * parent's tier, or to `variation.tier` when this node opens a variation.
   */
  tier?: number;
  children?: MoveNode[];
}

// ---------------------------------------------------------------------------
// Compiled (runtime) Book: FEN-keyed for O(1) lookup during play.
// ---------------------------------------------------------------------------

export interface WhiteOption {
  san: San;
  weight: number;
  tier: number;
}

export interface BlackReply {
  san: San;
  idea: string;
  tier: number;
}

export interface CompiledBook {
  startFen: Fen;
  /** White-to-move position -> weighted options. */
  white: Map<Fen, WhiteOption[]>;
  /** Black-to-move position -> the single canonical reply. */
  black: Map<Fen, BlackReply>;
  /** All known variations. */
  variations: VariationDef[];
  /** variation id -> the forced sequence of White SAN moves that defines it. */
  variationLine: Map<string, San[]>;
  /**
   * Set of `${fenBefore}|${san}` for every variation's defining White move. Used by
   * the run engine to keep an encounter from drifting into a *different* variation's
   * main branch during weighted-random play (variations are entered only via their
   * own encounter — preserving the coverage guarantee).
   */
  definingMoves: Set<string>;
}
