import { Chessground } from "chessground";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import { Chess } from "chess.js";

export type MoveHandler = (from: string, to: string) => void;

/** Thin wrapper around chessground that knows how to show a Black-to-move position. */
export class Board {
  private readonly cg: Api;

  constructor(el: HTMLElement, onMove: MoveHandler) {
    this.cg = Chessground(el, {
      orientation: "black", // the player is Black (SPEC §7)
      coordinates: true,
      animation: { enabled: true, duration: 220 },
      highlight: { lastMove: true, check: true },
      drawable: { enabled: true, visible: true },
      movable: {
        free: false,
        color: "black",
        showDests: true,
        events: { after: (orig, dest) => onMove(orig, dest) },
      },
    });
  }

  /** Render a Black-to-move position with only legal destinations enabled. */
  awaitBlackMove(fen: string, animate = true, clearLastMove = false): void {
    this.cg.set({
      fen,
      turnColor: "black",
      animation: { enabled: animate, duration: 220 },
      movable: { color: "black", dests: legalDests(fen) },
      drawable: { autoShapes: [] },
      // On a mistake revert, drop the wrong move's highlight so only the hint shows.
      ...(clearLastMove ? { lastMove: undefined } : {}),
    });
  }

  /** Lock the board (end-of-run states). */
  freeze(fen: string): void {
    this.cg.set({
      fen,
      movable: { color: undefined, dests: new Map() },
      drawable: { autoShapes: [] },
    });
  }

  /** Draw a green arrow showing the correct move (mistake reveal). */
  showHint(from: string, to: string): void {
    this.cg.setShapes([{ orig: from as Key, dest: to as Key, brush: "green" }]);
  }
}

/** Map every legal move in `fen` to chessground's orig -> dests form. */
function legalDests(fen: string): Map<Key, Key[]> {
  const chess = new Chess(fen);
  const dests = new Map<Key, Key[]>();
  for (const m of chess.moves({ verbose: true })) {
    const arr = dests.get(m.from as Key) ?? [];
    arr.push(m.to as Key);
    dests.set(m.from as Key, arr);
  }
  return dests;
}
