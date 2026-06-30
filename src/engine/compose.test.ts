import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { composeTree, tagVariations, type DraftLine, type VariationSpec } from "./compose";
import { compileBook } from "./book";

function fenAfter(...moves: string[]): string {
  const c = new Chess();
  for (const m of moves) c.move(m);
  return c.fen();
}

const advance: DraftLine = {
  label: "Advance",
  plies: [
    { san: "e4", side: "w", weight: 10 },
    { san: "c6", side: "b", idea: "Caro-Kann" },
    { san: "d4", side: "w" },
    { san: "d5", side: "b", idea: "strike the centre" },
    { san: "e5", side: "w", weight: 5 },
    { san: "Bf5", side: "b", idea: "bishop outside the chain" },
    { san: "Nf3", side: "w" },
    { san: "e6", side: "b", idea: "support the centre" },
  ],
};
const exchange: DraftLine = {
  label: "Exchange",
  plies: [
    { san: "e4", side: "w", weight: 10 },
    { san: "c6", side: "b", idea: "Caro-Kann" },
    { san: "d4", side: "w" },
    { san: "d5", side: "b", idea: "strike the centre" },
    { san: "exd5", side: "w", weight: 3 },
    { san: "cxd5", side: "b", idea: "recapture to the centre" },
    { san: "Bd3", side: "w" },
    { san: "Nc6", side: "b", idea: "develop" },
  ],
};

const specs: VariationSpec[] = [
  { id: "advance", name: "Advance", tier: 1, whiteLine: ["e4", "d4", "e5"] },
  { id: "exchange", name: "Exchange", tier: 1, whiteLine: ["e4", "d4", "exd5"] },
];

describe("composeTree", () => {
  it("collapses shared prefixes into one tree", () => {
    const tree = composeTree([advance, exchange]);
    expect(tree).toHaveLength(1); // single root: e4
    const e4 = tree[0]!;
    expect(e4.move).toBe("e4");
    const c6 = e4.children![0]!;
    expect(c6.move).toBe("c6");
    const d4 = c6.children![0]!;
    const d5 = d4.children![0]!;
    // d5 branches into the two variations' White 3rd moves.
    expect(d5.children!.map((n) => n.move).sort()).toEqual(["e5", "exd5"]);
  });

  it("retains Black ideas and White weights", () => {
    const tree = composeTree([advance, exchange]);
    const e4 = tree[0]!;
    expect(e4.weight).toBe(10);
    expect(e4.children![0]!.idea).toBe("Caro-Kann");
  });
});

describe("tagVariations + compileBook", () => {
  it("produces a compilable book with the expected variations", () => {
    const tree = composeTree([advance, exchange]);
    tagVariations(tree, specs);
    const book = compileBook(tree);

    expect(book.variations.map((v) => v.id).sort()).toEqual(["advance", "exchange"]);
    expect(book.variationLine.get("advance")).toEqual(["e4", "d4", "e5"]);
    expect(book.variationLine.get("exchange")).toEqual(["e4", "d4", "exd5"]);
    expect(book.black.get(fenAfter("e4"))?.san).toBe("c6");
    expect(book.black.get(fenAfter("e4", "c6", "d4", "d5", "e5"))?.san).toBe("Bf5");
  });

  it("throws if a variation's whiteLine is absent from the tree", () => {
    const tree = composeTree([advance]);
    expect(() => tagVariations(tree, specs)).toThrow(/no node for exchange/);
  });
});
