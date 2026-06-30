// AUTO-GENERATED from the repertoire-authoring workflow (verified, all moves legal).
// Source of truth for the Caro-Kann Black repertoire. Edit lines here, then the book
// is composed + validated by compileBook (see repertoire.test.ts).
import { composeTree, tagVariations, type DraftLine, type VariationSpec } from "./compose";
import type { MoveNode } from "./types";

export const REPERTOIRE_LINES: DraftLine[] = [
  {
    "label": "advance: 4.Nf3 Short System (main)",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Solid: prepare ...d5 to challenge the center without blocking the c8-bishop."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike at e4 and enter Caro-Kann main lines."
      },
      {
        "san": "e5",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Develop the bishop outside the chain before ...e6 — the whole point of the Caro-Kann."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 50
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Support d5 and open the f8-bishop; prepare ...Nd7 and ...Ne7."
      },
      {
        "san": "Be2",
        "side": "w"
      },
      {
        "san": "Nd7",
        "side": "b",
        "idea": "Flexible development eyeing ...Ne7/...Ng6 and the ...c5 break."
      },
      {
        "san": "O-O",
        "side": "w"
      },
      {
        "san": "Ne7",
        "side": "b",
        "idea": "Reroute the knight to g6 to pressure e5 and contest f4/h4."
      },
      {
        "san": "Nbd2",
        "side": "w"
      },
      {
        "san": "Ng6",
        "side": "b",
        "idea": "Hit the e5 pawn and discourage White's kingside expansion."
      },
      {
        "san": "Nb3",
        "side": "w"
      },
      {
        "san": "Be7",
        "side": "b",
        "idea": "Finish development; prepare ...O-O and the freeing ...c5."
      }
    ]
  },
  {
    "label": "advance: 4.Nc3 with 5.g4 (Tal-style)",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Solid: prepare ...d5 to challenge the center."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike at e4 and enter Caro-Kann main lines."
      },
      {
        "san": "e5",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Develop the bishop outside the chain before ...e6."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 22
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Reinforce d5 (now also hit by Nc3) and complete the setup."
      },
      {
        "san": "g4",
        "side": "w"
      },
      {
        "san": "Bg6",
        "side": "b",
        "idea": "Retreat down the diagonal, keeping the bishop active and ready for ...c5."
      },
      {
        "san": "Nge2",
        "side": "w"
      },
      {
        "san": "c5",
        "side": "b",
        "idea": "Counterstrike the d4 base of the chain before White consolidates."
      },
      {
        "san": "h4",
        "side": "w"
      },
      {
        "san": "h6",
        "side": "b",
        "idea": "Secure the h7 retreat for the bishop and give the king luft against g5 ideas."
      },
      {
        "san": "Be3",
        "side": "w"
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop with pressure, piling up on the d4 pawn."
      }
    ]
  },
  {
    "label": "advance: 4.h4 h6 main line",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Solid: prepare ...d5."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge e4."
      },
      {
        "san": "e5",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Develop the bishop outside the chain."
      },
      {
        "san": "h4",
        "side": "w",
        "weight": 16
      },
      {
        "san": "h6",
        "side": "b",
        "idea": "Stop g4-g5 and the h5 trap, preserving a retreat for the f5-bishop."
      },
      {
        "san": "g4",
        "side": "w"
      },
      {
        "san": "Bd7",
        "side": "b",
        "idea": "Retreat to d7 to avoid being shut in; reroute via ...c5 and ...Nc6."
      },
      {
        "san": "h5",
        "side": "w"
      },
      {
        "san": "c5",
        "side": "b",
        "idea": "Hit d4 immediately to exploit White's loosened kingside."
      },
      {
        "san": "c3",
        "side": "w"
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and add a second attacker to d4."
      },
      {
        "san": "Be3",
        "side": "w"
      },
      {
        "san": "Qb6",
        "side": "b",
        "idea": "Pressure b2 and pile up on d4, exploiting White's neglected queenside."
      }
    ]
  },
  {
    "label": "advance: 4.Be3 quiet setup",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Solid: prepare ...d5."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge e4."
      },
      {
        "san": "e5",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Develop the bishop outside the chain."
      },
      {
        "san": "Be3",
        "side": "w",
        "weight": 7
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Solid central support; build the standard ...Nd7/...Ne7-g6 structure."
      },
      {
        "san": "Nd2",
        "side": "w"
      },
      {
        "san": "Nd7",
        "side": "b",
        "idea": "Flexible development aiming at ...Ne7/...Ng6 and ...c5."
      },
      {
        "san": "Ngf3",
        "side": "w"
      },
      {
        "san": "Ne7",
        "side": "b",
        "idea": "Head for g6 to attack the e5 pawn."
      },
      {
        "san": "Be2",
        "side": "w"
      },
      {
        "san": "Ng6",
        "side": "b",
        "idea": "Press e5 and gain kingside space."
      },
      {
        "san": "O-O",
        "side": "w"
      },
      {
        "san": "Be7",
        "side": "b",
        "idea": "Complete development; prepare ...O-O and the ...c5 break."
      }
    ]
  },
  {
    "label": "advance: 4.c3 slow setup",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Solid: prepare ...d5."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge e4."
      },
      {
        "san": "e5",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Develop the bishop outside the chain."
      },
      {
        "san": "c3",
        "side": "w",
        "weight": 5
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Support d5 and start the standard ...Nd7/...Ne7-g6 plan."
      },
      {
        "san": "Be2",
        "side": "w"
      },
      {
        "san": "Nd7",
        "side": "b",
        "idea": "Develop flexibly toward ...Ne7 and ...c5."
      },
      {
        "san": "Nf3",
        "side": "w"
      },
      {
        "san": "Ne7",
        "side": "b",
        "idea": "Route the knight to g6 against e5."
      },
      {
        "san": "O-O",
        "side": "w"
      },
      {
        "san": "Ng6",
        "side": "b",
        "idea": "Attack e5 and grab kingside space."
      },
      {
        "san": "Nbd2",
        "side": "w"
      },
      {
        "san": "Be7",
        "side": "b",
        "idea": "Complete development; prepare ...O-O and ...c5."
      }
    ]
  },
  {
    "label": "exchange: Main line: 4.Bd3 6.Bf4 7.Qb3 — classical ...Na5",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 on a solid base"
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center immediately"
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture; sound symmetrical structure with easy development"
      },
      {
        "san": "Bd3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and pressure d4"
      },
      {
        "san": "c3",
        "side": "w",
        "weight": 9
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and contest the e4/e5 squares"
      },
      {
        "san": "Bf4",
        "side": "w",
        "weight": 8
      },
      {
        "san": "Bg4",
        "side": "b",
        "idea": "Activate the light-squared bishop before ...e6 locks it in"
      },
      {
        "san": "Qb3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Na5",
        "side": "b",
        "idea": "Hit the queen and, from a5, cover b7 against Qxb7"
      },
      {
        "san": "Qa4+",
        "side": "w"
      },
      {
        "san": "Bd7",
        "side": "b",
        "idea": "Block with tempo (attacks Qa4); reroute the knight via c6 and play ...e6"
      }
    ]
  },
  {
    "label": "exchange: 4.Bd3 with 6.Nf3",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 on a solid base"
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center immediately"
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture; symmetrical structure with free piece play"
      },
      {
        "san": "Bd3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and pressure d4"
      },
      {
        "san": "c3",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and contest e4"
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 4
      },
      {
        "san": "Bg4",
        "side": "b",
        "idea": "Pin the f3-knight against the queen"
      },
      {
        "san": "h3",
        "side": "w"
      },
      {
        "san": "Bh5",
        "side": "b",
        "idea": "Keep the pin and the bishop's activity"
      },
      {
        "san": "O-O",
        "side": "w"
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Finish development; prepare ...Bd6 and ...O-O"
      }
    ]
  },
  {
    "label": "exchange: 4.Bd3 6.Bf4 Bg4 7.Nf3 (no Qb3)",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 on a solid base"
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center immediately"
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture; symmetrical structure with free piece play"
      },
      {
        "san": "Bd3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and pressure d4"
      },
      {
        "san": "c3",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and contest e4"
      },
      {
        "san": "Bf4",
        "side": "w",
        "weight": 8
      },
      {
        "san": "Bg4",
        "side": "b",
        "idea": "Activate the light bishop before ...e6"
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 3
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Prepare ...Bd6 to challenge the f4-bishop"
      },
      {
        "san": "O-O",
        "side": "w"
      },
      {
        "san": "Bd6",
        "side": "b",
        "idea": "Offer to trade off White's active dark-squared bishop"
      }
    ]
  },
  {
    "label": "exchange: 4.Nf3 (5.c3 transposing to the main setup)",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 on a solid base"
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center immediately"
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture; symmetrical structure with free piece play"
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 5
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and hit d4"
      },
      {
        "san": "c3",
        "side": "w",
        "weight": 4
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and contest e4"
      },
      {
        "san": "Bd3",
        "side": "w"
      },
      {
        "san": "Bg4",
        "side": "b",
        "idea": "Pin the f3-knight"
      },
      {
        "san": "Qb3",
        "side": "w"
      },
      {
        "san": "Na5",
        "side": "b",
        "idea": "Hit the queen and cover b7"
      },
      {
        "san": "Qa4+",
        "side": "w"
      },
      {
        "san": "Bd7",
        "side": "b",
        "idea": "Block with tempo; the knight returns via c6"
      }
    ]
  },
  {
    "label": "exchange: 4.Nf3 5.Bb5 (independent try)",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 on a solid base"
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center immediately"
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture; symmetrical structure with free piece play"
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 5
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and hit d4"
      },
      {
        "san": "Bb5",
        "side": "w",
        "weight": 3
      },
      {
        "san": "a6",
        "side": "b",
        "idea": "Question the pinning bishop at once"
      },
      {
        "san": "Bxc6+",
        "side": "w"
      },
      {
        "san": "bxc6",
        "side": "b",
        "idea": "Recapture toward the center and take the bishop pair"
      },
      {
        "san": "O-O",
        "side": "w"
      },
      {
        "san": "Bg4",
        "side": "b",
        "idea": "Develop actively and pin the f3-knight"
      },
      {
        "san": "h3",
        "side": "w"
      },
      {
        "san": "Bh5",
        "side": "b",
        "idea": "Maintain the pin; the bishop pair gives long-term play"
      }
    ]
  },
  {
    "label": "exchange: 4.c3 (slow) — Black develops normally",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 on a solid base"
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center immediately"
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture; symmetrical structure with free piece play"
      },
      {
        "san": "c3",
        "side": "w",
        "weight": 2
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and pressure d4"
      },
      {
        "san": "Bd3",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and eye e4"
      },
      {
        "san": "Nf3",
        "side": "w"
      },
      {
        "san": "Bg4",
        "side": "b",
        "idea": "Pin the f3-knight"
      },
      {
        "san": "O-O",
        "side": "w"
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Complete development, prepare ...Bd6"
      },
      {
        "san": "Re1",
        "side": "w"
      },
      {
        "san": "Bd6",
        "side": "b",
        "idea": "Develop the bishop and castle next"
      }
    ]
  },
  {
    "label": "exchange: 4.Bf4 (early) — transposes to the main line",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 on a solid base"
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center immediately"
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture; symmetrical structure with free piece play"
      },
      {
        "san": "Bf4",
        "side": "w",
        "weight": 2
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and pressure d4"
      },
      {
        "san": "Bd3",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and eye e4"
      },
      {
        "san": "c3",
        "side": "w"
      },
      {
        "san": "Bg4",
        "side": "b",
        "idea": "Activate the bishop before ...e6"
      },
      {
        "san": "Qb3",
        "side": "w"
      },
      {
        "san": "Na5",
        "side": "b",
        "idea": "Hit the queen and guard b7"
      },
      {
        "san": "Qa4+",
        "side": "w"
      },
      {
        "san": "Bd7",
        "side": "b",
        "idea": "Block with tempo; transposes to the classical main line"
      }
    ]
  },
  {
    "label": "panov: Main: 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Bd2",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: prepare ...d5 to strike the center without blocking the c8-bishop."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge e4 immediately; head for the Panov structure."
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture, reaching the Panov-Botvinnik pawn structure."
      },
      {
        "san": "c4",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Canonical: develop and pressure d5/c4 at once."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Solid; supports d5 and frees the f8-bishop for ...Bb4."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "Bb4",
        "side": "b",
        "idea": "Pin the c3-knight, increasing pressure on d5/d4 and the center."
      },
      {
        "san": "cxd5",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Nxd5",
        "side": "b",
        "idea": "Recapture and centralize; the knight on d5 eyes c3 (still pinned)."
      },
      {
        "san": "Bd2",
        "side": "w",
        "weight": 8
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop with tempo against d4; prepare ...O-O keeping the b4-bishop active."
      }
    ]
  },
  {
    "label": "panov: 5.Nc3 e6 6.Bg5",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann move order toward ...d5."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike the center."
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Reach the Panov structure."
      },
      {
        "san": "c4",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop, pressure c4/d5."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Stay in the solid ...e6 setup."
      },
      {
        "san": "Bg5",
        "side": "w",
        "weight": 5
      },
      {
        "san": "Be7",
        "side": "b",
        "idea": "Support f6 and prepare quick castling (here ...Bb4 is less natural)."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 8
      },
      {
        "san": "O-O",
        "side": "b",
        "idea": "King safety before resolving the central tension."
      },
      {
        "san": "Rc1",
        "side": "w",
        "weight": 6
      },
      {
        "san": "dxc4",
        "side": "b",
        "idea": "Hand White an isolated d4-pawn to blockade and attack with ...Nc6/...b6/...Bd7."
      }
    ]
  },
  {
    "label": "panov: 5.Nc3 e6 6.Nf3 Bb4 7.Bd3",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann setup."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Contest the center."
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Panov structure."
      },
      {
        "san": "c4",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and pressure c4/d5."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Support d5, prepare ...Bb4."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "Bb4",
        "side": "b",
        "idea": "Pin Nc3 and pressure the center."
      },
      {
        "san": "Bd3",
        "side": "w",
        "weight": 5
      },
      {
        "san": "dxc4",
        "side": "b",
        "idea": "Open the position and leave White with an isolated d-pawn."
      },
      {
        "san": "Bxc4",
        "side": "w"
      },
      {
        "san": "O-O",
        "side": "b",
        "idea": "Castle; follow up with ...Nc6/...b6/...Bd7 to blockade and besiege d4."
      }
    ]
  },
  {
    "label": "panov: 5.Nc3 e6 6.Nf3 Bb4 7.a3",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann setup."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike the center."
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Panov structure."
      },
      {
        "san": "c4",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Pressure c4/d5."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Solid; prepare ...Bb4."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "Bb4",
        "side": "b",
        "idea": "Pin Nc3."
      },
      {
        "san": "a3",
        "side": "w",
        "weight": 4
      },
      {
        "san": "Bxc3+",
        "side": "b",
        "idea": "Trade off to damage White's queenside pawns."
      },
      {
        "san": "bxc3",
        "side": "w"
      },
      {
        "san": "dxc4",
        "side": "b",
        "idea": "Regain the pawn and target White's weak doubled c-pawns and IQP structure."
      }
    ]
  },
  {
    "label": "panov: 5.cxd5 Nxd5 6.Nf3",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann setup."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Contest the center."
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Panov structure."
      },
      {
        "san": "c4",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Develop and pressure c4/d5."
      },
      {
        "san": "cxd5",
        "side": "w",
        "weight": 4
      },
      {
        "san": "Nxd5",
        "side": "b",
        "idea": "Recapture and centralize the knight."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Hit White's isolated d4-pawn immediately."
      },
      {
        "san": "Nc3",
        "side": "w"
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Reinforce the d5-knight (e6-pawn covers d5) and keep the ...e6/...Be7 setup."
      },
      {
        "san": "Bc4",
        "side": "w"
      },
      {
        "san": "Be7",
        "side": "b",
        "idea": "Develop and prepare ...O-O, continuing to pressure the isolated d4-pawn."
      }
    ]
  },
  {
    "label": "panov: 5.cxd5 Nxd5 6.Nc3",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann setup."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Contest the center."
      },
      {
        "san": "exd5",
        "side": "w"
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Panov structure."
      },
      {
        "san": "c4",
        "side": "w"
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Pressure c4/d5."
      },
      {
        "san": "cxd5",
        "side": "w",
        "weight": 4
      },
      {
        "san": "Nxd5",
        "side": "b",
        "idea": "Recapture, centralize."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 5
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Defend the centralized d5-knight (e6-pawn covers d5) and keep the ...e6 structure."
      },
      {
        "san": "Nf3",
        "side": "w"
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and pressure d4."
      },
      {
        "san": "Bd3",
        "side": "w"
      },
      {
        "san": "Be7",
        "side": "b",
        "idea": "Complete development, ready to castle and play against White's d4-pawn."
      }
    ]
  },
  {
    "label": "classical: Main Line (6.h4 7.Nf3)",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Solid: prepare ...d5 to challenge the center without shutting in the c8-bishop."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike at the center, the heart of the Caro-Kann."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "dxe4",
        "side": "b",
        "idea": "Capture to enter the Classical main lines with a free light bishop."
      },
      {
        "san": "Nxe4",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "The Classical move: develop the bishop outside the pawn chain before ...e6."
      },
      {
        "san": "Ng3",
        "side": "w"
      },
      {
        "san": "Bg6",
        "side": "b",
        "idea": "Keep the good bishop, sidestepping the trade and the knight's attack."
      },
      {
        "san": "h4",
        "side": "w",
        "weight": 10
      },
      {
        "san": "h6",
        "side": "b",
        "idea": "Give the bishop the h7 retreat and stop h5-h6 ideas trapping it."
      },
      {
        "san": "Nf3",
        "side": "w"
      },
      {
        "san": "Nd7",
        "side": "b",
        "idea": "Develop flexibly, preparing ...Ngf6 and supporting ...c5/...e5 breaks."
      },
      {
        "san": "h5",
        "side": "w"
      },
      {
        "san": "Bh7",
        "side": "b",
        "idea": "Tuck the bishop safely on h7; it can re-emerge after ...Bxd3."
      },
      {
        "san": "Bd3",
        "side": "w"
      },
      {
        "san": "Bxd3",
        "side": "b",
        "idea": "Trade light bishops, easing the slight space disadvantage."
      },
      {
        "san": "Qxd3",
        "side": "w"
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Complete the structure, open the f8-bishop's diagonal, and prepare ...Ngf6 and queenside castling."
      }
    ]
  },
  {
    "label": "classical: 6.Nf3 (transposes)",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Solid: prepare ...d5 without blocking the c8-bishop."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Challenge the center at once."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "dxe4",
        "side": "b",
        "idea": "Enter the Classical lines."
      },
      {
        "san": "Nxe4",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Develop the light bishop actively before ...e6."
      },
      {
        "san": "Ng3",
        "side": "w"
      },
      {
        "san": "Bg6",
        "side": "b",
        "idea": "Retreat keeping the bishop, avoiding the trade."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 5
      },
      {
        "san": "Nd7",
        "side": "b",
        "idea": "Develop and stay flexible; this transposes once White plays h4."
      },
      {
        "san": "h4",
        "side": "w"
      },
      {
        "san": "h6",
        "side": "b",
        "idea": "Make the h7 retreat for the bishop and blunt h5-h6."
      },
      {
        "san": "h5",
        "side": "w"
      },
      {
        "san": "Bh7",
        "side": "b",
        "idea": "Safe square for the bishop."
      },
      {
        "san": "Bd3",
        "side": "w"
      },
      {
        "san": "Bxd3",
        "side": "b",
        "idea": "Exchange the light-squared bishops."
      },
      {
        "san": "Qxd3",
        "side": "w"
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Solidify and prepare ...Ngf6, ...Qc7 and long castling."
      }
    ]
  },
  {
    "label": "classical: 6.Bc4",
    "plies": [
      {
        "san": "e4",
        "side": "w"
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Prepare ...d5 the Caro-Kann way."
      },
      {
        "san": "d4",
        "side": "w"
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike the center."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 10
      },
      {
        "san": "dxe4",
        "side": "b",
        "idea": "Take into the Classical main lines."
      },
      {
        "san": "Nxe4",
        "side": "w"
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Classical development of the bishop."
      },
      {
        "san": "Ng3",
        "side": "w"
      },
      {
        "san": "Bg6",
        "side": "b",
        "idea": "Keep the strong bishop."
      },
      {
        "san": "Bc4",
        "side": "w",
        "weight": 2
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Blunt the bishop's aim at f7 and free the f8-bishop."
      },
      {
        "san": "N1e2",
        "side": "w"
      },
      {
        "san": "Bd6",
        "side": "b",
        "idea": "Active bishop eyeing g3/h2, preparing ...Ne7, ...Nd7 and castling."
      },
      {
        "san": "h4",
        "side": "w"
      },
      {
        "san": "h6",
        "side": "b",
        "idea": "Give the g6-bishop the h7 square and restrain h5."
      }
    ]
  },
  {
    "label": "sidelines: (a) 2.Nf3",
    "plies": [
      {
        "san": "e4",
        "side": "w",
        "weight": 10
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: challenge e4 while keeping a sound pawn structure."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 4
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike the center immediately."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "dxe4",
        "side": "b",
        "idea": "Capture, steering into the Classical setup."
      },
      {
        "san": "Nxe4",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Classical Caro: develop the bishop outside the pawn chain before ...e6."
      },
      {
        "san": "Ng3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Bg6",
        "side": "b",
        "idea": "Retreat keeping the good bishop on its diagonal."
      },
      {
        "san": "h4",
        "side": "w",
        "weight": 5
      },
      {
        "san": "h6",
        "side": "b",
        "idea": "Make luft for the bishop and stop the h4-h5-h6 trap."
      },
      {
        "san": "h5",
        "side": "w",
        "weight": 5
      },
      {
        "san": "Bh7",
        "side": "b",
        "idea": "Tuck the bishop on h7; it stays strong while Black finishes with ...Nd7, ...e6, ...Ngf6."
      }
    ]
  },
  {
    "label": "sidelines: (b) Two Knights 2.Nc3 d5 3.Nf3",
    "plies": [
      {
        "san": "e4",
        "side": "w",
        "weight": 10
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann: challenge e4 while keeping a sound pawn structure."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Strike the center immediately."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 4
      },
      {
        "san": "dxe4",
        "side": "b",
        "idea": "Capture, steering into the Classical setup."
      },
      {
        "san": "Nxe4",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Bf5",
        "side": "b",
        "idea": "Classical Caro: develop the bishop outside the pawn chain before ...e6."
      },
      {
        "san": "Ng3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Bg6",
        "side": "b",
        "idea": "Retreat keeping the good bishop on its diagonal."
      },
      {
        "san": "h4",
        "side": "w",
        "weight": 5
      },
      {
        "san": "h6",
        "side": "b",
        "idea": "Make luft for the bishop and stop the h4-h5-h6 trap."
      },
      {
        "san": "h5",
        "side": "w",
        "weight": 5
      },
      {
        "san": "Bh7",
        "side": "b",
        "idea": "Tuck the bishop on h7; it stays strong while Black finishes with ...Nd7, ...e6, ...Ngf6."
      }
    ]
  },
  {
    "label": "sidelines: (c) 2.c4",
    "plies": [
      {
        "san": "e4",
        "side": "w",
        "weight": 10
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann."
      },
      {
        "san": "c4",
        "side": "w",
        "weight": 3
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Hit the center before White builds a big pawn front."
      },
      {
        "san": "exd5",
        "side": "w",
        "weight": 5
      },
      {
        "san": "cxd5",
        "side": "b",
        "idea": "Recapture, keeping a healthy pawn on d5."
      },
      {
        "san": "cxd5",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Nf6",
        "side": "b",
        "idea": "Attack the d5-pawn and prepare to regain it with a centralized knight."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Nxd5",
        "side": "b",
        "idea": "Regain the pawn with an active knight; the structure is symmetrical and equal."
      },
      {
        "san": "Nf3",
        "side": "w",
        "weight": 5
      },
      {
        "san": "Nc6",
        "side": "b",
        "idea": "Develop and complete mobilization, controlling key central squares."
      },
      {
        "san": "Bc4",
        "side": "w",
        "weight": 4
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Solidify d5 (the queen covers the knight), open the bishop and prepare ...Be7 and ...O-O."
      }
    ]
  },
  {
    "label": "sidelines: (d) Fantasy 2.d4 d5 3.f3",
    "plies": [
      {
        "san": "e4",
        "side": "w",
        "weight": 10
      },
      {
        "san": "c6",
        "side": "b",
        "idea": "Caro-Kann."
      },
      {
        "san": "d4",
        "side": "w",
        "weight": 8
      },
      {
        "san": "d5",
        "side": "b",
        "idea": "Classical central challenge."
      },
      {
        "san": "f3",
        "side": "w",
        "weight": 3
      },
      {
        "san": "e6",
        "side": "b",
        "idea": "Solid French-like setup, staying sound against White's f3 plan."
      },
      {
        "san": "Nc3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "Bb4",
        "side": "b",
        "idea": "Pin the knight and pressure e4 before White consolidates."
      },
      {
        "san": "a3",
        "side": "w",
        "weight": 4
      },
      {
        "san": "Bxc3+",
        "side": "b",
        "idea": "Capture, doubling White's pawns and weakening the center."
      },
      {
        "san": "bxc3",
        "side": "w",
        "weight": 6
      },
      {
        "san": "dxe4",
        "side": "b",
        "idea": "Open the position to target White's loose center and the weak e4-pawn."
      },
      {
        "san": "fxe4",
        "side": "w",
        "weight": 6
      },
      {
        "san": "c5",
        "side": "b",
        "idea": "Strike at d4, opening lines against White's compromised queenside pawns."
      }
    ]
  }
];

export const REPERTOIRE_SPECS: VariationSpec[] = [
  {
    "id": "advance",
    "name": "Advance Variation",
    "tier": 1,
    "whiteLine": [
      "e4",
      "d4",
      "e5"
    ]
  },
  {
    "id": "exchange",
    "name": "Exchange Variation",
    "tier": 1,
    "whiteLine": [
      "e4",
      "d4",
      "exd5"
    ]
  },
  {
    "id": "classical",
    "name": "Classical Main Line",
    "tier": 2,
    "whiteLine": [
      "e4",
      "d4",
      "Nc3"
    ]
  },
  {
    "id": "panov",
    "name": "Panov-Botvinnik Attack",
    "tier": 2,
    "whiteLine": [
      "e4",
      "d4",
      "exd5",
      "c4"
    ]
  },
  {
    "id": "fantasy",
    "name": "Fantasy Variation",
    "tier": 4,
    "whiteLine": [
      "e4",
      "d4",
      "f3"
    ]
  },
  {
    "id": "reti-nf3",
    "name": "2.Nf3 (Two Knights setup)",
    "tier": 3,
    "whiteLine": [
      "e4",
      "Nf3"
    ]
  },
  {
    "id": "two-knights",
    "name": "Two Knights 2.Nc3",
    "tier": 3,
    "whiteLine": [
      "e4",
      "Nc3"
    ]
  },
  {
    "id": "sideline-c4",
    "name": "2.c4",
    "tier": 4,
    "whiteLine": [
      "e4",
      "c4"
    ]
  }
];

/** The highest tier present in the repertoire. */
export const MAX_TIER = 4;

/** Compose + tag the authoring tree (fed to compileBook). */
export function buildRepertoireTree(): MoveNode[] {
  const tree = composeTree(REPERTOIRE_LINES);
  tagVariations(tree, REPERTOIRE_SPECS);
  return tree;
}
