import type { MoveNode } from "./types";

/**
 * A small, real Caro-Kann fragment used for tests and early dev. NOT the final
 * repertoire — the full authored Book (with user review) is M2/Task 2. Tiers here:
 * Advance + Exchange at Tier 1, Classical at Tier 2.
 */
export const FIXTURE_TREE: MoveNode[] = [
  {
    move: "e4",
    children: [
      {
        move: "c6",
        idea: "The Caro-Kann: solid, prepares ...d5 with pawn support.",
        children: [
          {
            move: "d4",
            children: [
              {
                move: "d5",
                idea: "Challenge the centre immediately.",
                children: [
                  // --- Advance (Tier 1) ---
                  {
                    move: "e5",
                    weight: 5,
                    variation: { id: "advance", name: "Advance Variation", tier: 1 },
                    children: [
                      {
                        move: "Bf5",
                        idea: "Develop the light bishop outside the chain before ...e6.",
                        children: [
                          {
                            move: "Nf3",
                            children: [
                              {
                                move: "e6",
                                idea: "Now buttress the centre; the bishop is already free.",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  // --- Exchange (Tier 1), with a weighted White branch at move 4 ---
                  {
                    move: "exd5",
                    weight: 3,
                    variation: { id: "exchange", name: "Exchange Variation", tier: 1 },
                    children: [
                      {
                        move: "cxd5",
                        idea: "Recapture toward the centre.",
                        children: [
                          {
                            move: "Bd3",
                            weight: 2,
                            children: [
                              {
                                move: "Nc6",
                                idea: "Develop, pressuring d4 and preparing ...Nf6.",
                              },
                            ],
                          },
                          {
                            move: "Nf3",
                            weight: 1,
                            children: [
                              {
                                move: "Nc6",
                                idea: "Develop naturally; same plan against the knight.",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  // --- Classical / Two Knights main (Tier 2) ---
                  {
                    move: "Nc3",
                    weight: 4,
                    variation: { id: "classical", name: "Classical Main Line", tier: 2 },
                    children: [
                      {
                        move: "dxe4",
                        idea: "Capture; after Nxe4 the light bishop comes to f5.",
                        children: [
                          {
                            move: "Nxe4",
                            children: [
                              {
                                move: "Bf5",
                                idea: "Hit the knight and develop the light bishop.",
                                children: [
                                  {
                                    move: "Ng3",
                                    children: [
                                      {
                                        move: "Bg6",
                                        idea: "Retreat, keeping the bishop on the b1-h7 diagonal.",
                                      },
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
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
