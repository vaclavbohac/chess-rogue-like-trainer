import type { MoveNode, San, VariationDef } from "./types";

/**
 * Build-time helper: turn the repertoire-authoring workflow's flat lines (full SAN
 * sequences from 1.e4) into the authoring {@link MoveNode} tree, then tag each
 * variation's defining move. The result is fed to compileBook, which deterministically
 * validates legality, the single-canonical-reply rule, and transposition consistency.
 */

export interface DraftPly {
  san: San;
  side: "w" | "b";
  weight?: number;
  idea?: string;
}

export interface DraftLine {
  label?: string;
  plies: DraftPly[];
}

/** Merge full-from-move-1 lines into a single MoveNode tree (shared prefixes collapse). */
export function composeTree(lines: DraftLine[]): MoveNode[] {
  const roots: MoveNode[] = [];
  for (const line of lines) {
    let siblings = roots;
    for (const ply of line.plies) {
      let node = siblings.find((n) => n.move === ply.san);
      if (!node) {
        node = { move: ply.san };
        siblings.push(node);
      }
      if (ply.side === "b" && ply.idea && !node.idea) node.idea = ply.idea;
      if (ply.side === "w" && ply.weight != null) {
        node.weight = node.weight == null ? ply.weight : Math.max(node.weight, ply.weight);
      }
      node.children ??= [];
      siblings = node.children;
    }
  }
  return roots;
}

export interface VariationSpec extends VariationDef {
  /** The forced sequence of White SAN moves that defines the variation. */
  whiteLine: San[];
}

/** Tag each variation's defining White move in the tree (mutates in place). */
export function tagVariations(tree: MoveNode[], specs: VariationSpec[]): void {
  for (const spec of specs) {
    const node = followWhiteLine(tree, spec.whiteLine);
    if (!node) {
      throw new Error(
        `tagVariations: no node for ${spec.id} whiteLine "${spec.whiteLine.join(" ")}"`,
      );
    }
    node.variation = { id: spec.id, name: spec.name, tier: spec.tier };
    node.tier ??= spec.tier;
  }
}

/** Walk White moves (with the single canonical Black reply between each) to the last. */
function followWhiteLine(tree: MoveNode[], whiteLine: San[]): MoveNode | undefined {
  let siblings = tree;
  for (let i = 0; i < whiteLine.length; i++) {
    const node = siblings.find((n) => n.move === whiteLine[i]);
    if (!node) return undefined;
    if (i === whiteLine.length - 1) return node;
    const blackChildren = node.children ?? [];
    if (blackChildren.length !== 1) return undefined; // expect one canonical Black reply
    siblings = blackChildren[0]!.children ?? [];
  }
  return undefined;
}
