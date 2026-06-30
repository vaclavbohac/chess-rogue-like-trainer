import { Chess } from "chess.js";
import type {
  BlackReply,
  CompiledBook,
  Fen,
  MoveNode,
  San,
  VariationDef,
  WhiteOption,
} from "./types";

/**
 * Compile the authored move tree into a FEN-keyed {@link CompiledBook}.
 *
 * Walks the tree playing each move through chess.js (which validates legality —
 * an illegal authored move throws here, surfacing book bugs at load time).
 */
export function compileBook(tree: MoveNode[]): CompiledBook {
  const startFen = new Chess().fen();
  const white = new Map<Fen, WhiteOption[]>();
  const black = new Map<Fen, BlackReply>();
  const variations: VariationDef[] = [];
  const variationLine = new Map<string, San[]>();

  function fenAfter(fenBefore: Fen, move: San): Fen {
    const c = new Chess(fenBefore);
    c.move(move); // throws on illegal move -> authoring error
    return c.fen();
  }

  function walk(
    nodes: MoveNode[],
    fenBefore: Fen,
    parentTier: number,
    whiteLine: San[],
  ): void {
    const sideToMove = new Chess(fenBefore).turn();

    if (sideToMove === "w") {
      // Union options across transposing paths (keyed by FEN). Overlapping SANs
      // must agree on weight/tier; otherwise it's an authoring conflict.
      const options: WhiteOption[] = white.get(fenBefore) ?? [];
      for (const node of nodes) {
        const tier = node.tier ?? node.variation?.tier ?? parentTier;
        const weight = node.weight ?? 1;
        const existing = options.find((o) => o.san === node.move);
        if (existing) {
          if (existing.weight !== weight || existing.tier !== tier) {
            throw new Error(
              `Transposition conflict (White) at ${fenBefore}: "${node.move}" has weight/tier ` +
                `${existing.weight}/${existing.tier} vs ${weight}/${tier}`,
            );
          }
        } else {
          options.push({ san: node.move, weight, tier });
        }

        const nextWhiteLine = [...whiteLine, node.move];
        if (node.variation) {
          variations.push(node.variation);
          variationLine.set(node.variation.id, nextWhiteLine);
        }
        const after = fenAfter(fenBefore, node.move); // validates legality (even leaves)
        if (node.children?.length) {
          walk(node.children, after, tier, nextWhiteLine);
        }
      }
      white.set(fenBefore, options);
    } else {
      // Black to move: exactly one canonical reply (see CONTEXT.md / Q8).
      if (nodes.length !== 1) {
        throw new Error(
          `Black position needs exactly one canonical reply but found ${nodes.length}: ${fenBefore}`,
        );
      }
      const node = nodes[0]!;
      const tier = node.tier ?? parentTier;
      const after = fenAfter(fenBefore, node.move); // validates legality (even leaves)
      // Transpositions may revisit this FEN: a different canonical reply is a
      // conflict (would silently teach a wrong move); an agreeing one is fine.
      const existing = black.get(fenBefore);
      if (existing) {
        if (fenAfter(fenBefore, existing.san) !== after) {
          throw new Error(
            `Transposition conflict (Black) at ${fenBefore}: ` +
              `"${existing.san}" vs "${node.move}"`,
          );
        }
      } else {
        black.set(fenBefore, { san: node.move, idea: node.idea ?? "", tier });
      }
      if (node.children?.length) {
        walk(node.children, after, tier, whiteLine);
      }
    }
  }

  walk(tree, startFen, 1, []);
  return { startFen, white, black, variations, variationLine };
}

/** White options available at `fen`, filtered to those unlocked at `tier`. */
export function whiteOptionsAt(
  book: CompiledBook,
  fen: Fen,
  tier: number,
): WhiteOption[] {
  return (book.white.get(fen) ?? []).filter((o) => o.tier <= tier);
}

/** The canonical Black reply at `fen`, or undefined if out of book at `tier`. */
export function blackReplyAt(
  book: CompiledBook,
  fen: Fen,
  tier: number,
): BlackReply | undefined {
  const r = book.black.get(fen);
  return r && r.tier <= tier ? r : undefined;
}

export type MoveInput = San | { from: string; to: string; promotion?: string };

export interface AppliedMove {
  san: San;
  fen: Fen;
}

/**
 * Attempt a move from `fen`. Returns the normalized SAN + resulting FEN, or null
 * if the move is illegal. Accepts SAN or from/to (the board UI uses from/to).
 */
export function tryMove(fen: Fen, input: MoveInput): AppliedMove | null {
  const c = new Chess(fen);
  try {
    const m = c.move(input);
    return { san: m.san, fen: c.fen() };
  } catch {
    return null;
  }
}
