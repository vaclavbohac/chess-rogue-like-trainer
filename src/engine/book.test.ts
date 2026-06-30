import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import {
  blackReplyAt,
  compileBook,
  tryMove,
  whiteOptionsAt,
} from "./book";
import { FIXTURE_TREE } from "./fixture";
import type { MoveNode } from "./types";

const book = compileBook(FIXTURE_TREE);
const START = new Chess().fen();

function fenAfter(...moves: string[]): string {
  const c = new Chess();
  for (const m of moves) c.move(m);
  return c.fen();
}

describe("compileBook", () => {
  it("registers all variations with their forced White lines", () => {
    const ids = book.variations.map((v) => v.id).sort();
    expect(ids).toEqual(["advance", "classical", "exchange"]);
    expect(book.variationLine.get("advance")).toEqual(["e4", "d4", "e5"]);
    expect(book.variationLine.get("exchange")).toEqual(["e4", "d4", "exd5"]);
    expect(book.variationLine.get("classical")).toEqual(["e4", "d4", "Nc3"]);
  });

  it("indexes White options at the start position", () => {
    const opts = book.white.get(START);
    expect(opts?.map((o) => o.san)).toEqual(["e4"]);
  });

  it("stores the single canonical Black reply with its idea", () => {
    const afterE4 = fenAfter("e4");
    const reply = book.black.get(afterE4);
    expect(reply?.san).toBe("c6");
    expect(reply?.idea).toMatch(/Caro-Kann/i);
  });

  it("throws on a Black position with more than one reply", () => {
    const bad: MoveNode[] = [
      {
        move: "e4",
        children: [{ move: "c6" }, { move: "e5" }], // two Black replies
      },
    ];
    expect(() => compileBook(bad)).toThrow(/exactly one/i);
  });

  it("throws on an illegal authored move", () => {
    const bad: MoveNode[] = [{ move: "e5" }]; // illegal as White's first move
    expect(() => compileBook(bad)).toThrow();
  });
});

describe("transpositions", () => {
  // 1.e4 c6 2.Nf3 d5 3.Nc3 and 1.e4 c6 2.Nc3 d5 3.Nf3 reach the SAME Black-to-move
  // FEN. After the (agreeing) reply ...dxe4 they reach the same White-to-move FEN too.
  const converged = fenAfter("e4", "c6", "Nf3", "d5", "Nc3");
  const afterDxe4 = fenAfter("e4", "c6", "Nf3", "d5", "Nc3", "dxe4");

  it("merges agreeing transpositions and unions White options", () => {
    const tree: MoveNode[] = [
      {
        move: "e4",
        children: [
          {
            move: "c6",
            children: [
              {
                move: "Nf3",
                children: [
                  {
                    move: "d5",
                    children: [
                      {
                        move: "Nc3",
                        children: [
                          { move: "dxe4", idea: "x", children: [{ move: "Nxe4" }] },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                move: "Nc3",
                children: [
                  {
                    move: "d5",
                    children: [
                      {
                        move: "Nf3",
                        children: [
                          { move: "dxe4", idea: "y", children: [{ move: "d3" }] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    const b = compileBook(tree);
    expect(b.black.get(converged)?.san).toBe("dxe4");
    // White options from BOTH paths are unioned, not overwritten.
    expect(b.white.get(afterDxe4)?.map((o) => o.san).sort()).toEqual(["Nxe4", "d3"].sort());
  });

  it("throws on a conflicting Black reply at a transposed position", () => {
    const tree: MoveNode[] = [
      {
        move: "e4",
        children: [
          {
            move: "c6",
            children: [
              { move: "Nf3", children: [{ move: "d5", children: [{ move: "Nc3", children: [{ move: "dxe4", idea: "x" }] }] }] },
              { move: "Nc3", children: [{ move: "d5", children: [{ move: "Nf3", children: [{ move: "Bg4", idea: "y" }] }] }] },
            ],
          },
        ],
      },
    ];
    expect(() => compileBook(tree)).toThrow(/Transposition conflict \(Black\)/);
  });

  it("throws when a transposed White option disagrees on weight", () => {
    const tree: MoveNode[] = [
      {
        move: "e4",
        children: [
          {
            move: "c6",
            children: [
              { move: "Nf3", children: [{ move: "d5", children: [{ move: "Nc3", children: [{ move: "dxe4", idea: "x", children: [{ move: "Nxe4", weight: 2 }] }] }] }] },
              { move: "Nc3", children: [{ move: "d5", children: [{ move: "Nf3", children: [{ move: "dxe4", idea: "y", children: [{ move: "Nxe4", weight: 5 }] }] }] }] },
            ],
          },
        ],
      },
    ];
    expect(() => compileBook(tree)).toThrow(/Transposition conflict \(White\)/);
  });
});

describe("tier gating", () => {
  it("hides Classical at Tier 1 but shows it at Tier 2", () => {
    const afterD5 = fenAfter("e4", "c6", "d4", "d5");
    const t1 = whiteOptionsAt(book, afterD5, 1).map((o) => o.san).sort();
    const t2 = whiteOptionsAt(book, afterD5, 2).map((o) => o.san).sort();
    expect(t1).toEqual(["e5", "exd5"]);
    expect(t2).toEqual(["Nc3", "e5", "exd5"]);
  });

  it("treats a Black reply as out-of-book when its tier exceeds the run tier", () => {
    const afterNc3 = fenAfter("e4", "c6", "d4", "d5", "Nc3");
    expect(blackReplyAt(book, afterNc3, 1)).toBeUndefined(); // locked at Tier 1
    expect(blackReplyAt(book, afterNc3, 2)?.san).toBe("dxe4");
  });
});

describe("tryMove", () => {
  it("normalizes a legal SAN move and returns the resulting FEN", () => {
    const r = tryMove(START, "e4");
    expect(r?.san).toBe("e4");
    expect(r?.fen).toBe(fenAfter("e4"));
  });

  it("accepts from/to input (as the board UI provides)", () => {
    const r = tryMove(START, { from: "e2", to: "e4" });
    expect(r?.san).toBe("e4");
  });

  it("returns null for an illegal move", () => {
    expect(tryMove(START, "e5")).toBeNull();
    expect(tryMove(START, { from: "e2", to: "e9" })).toBeNull();
  });
});
