# Repertoire Review — Caro-Kann (Black)

Auto-drafted by the repertoire-authoring workflow and adversarially verified; **every
move was machine-validated as legal**. Please review for chess soundness — you are the
final authority (SPEC.md Q11). Edit `src/engine/repertoire.ts` to change anything.

Variations & tiers: Advance Variation (T1), Exchange Variation (T1), Classical Main Line (T2), Panov-Botvinnik Attack (T3), Fantasy Variation (T4), 2.Nf3 (Two Knights setup) (T4), Two Knights 2.Nc3 (T4), 2.c4 (T4).

## advance — confidence: high

### 4.Nf3 Short System (main)

`1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7 6.O-O Ne7 7.Nbd2 Ng6 8.Nb3 Be7`

- **c6** — Solid: prepare ...d5 to challenge the center without blocking the c8-bishop.
- **d5** — Strike at e4 and enter Caro-Kann main lines.
- **Bf5** — Develop the bishop outside the chain before ...e6 — the whole point of the Caro-Kann.
- **e6** — Support d5 and open the f8-bishop; prepare ...Nd7 and ...Ne7.
- **Nd7** — Flexible development eyeing ...Ne7/...Ng6 and the ...c5 break.
- **Ne7** — Reroute the knight to g6 to pressure e5 and contest f4/h4.
- **Ng6** — Hit the e5 pawn and discourage White's kingside expansion.
- **Be7** — Finish development; prepare ...O-O and the freeing ...c5.

### 4.Nc3 with 5.g4 (Tal-style)

`1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nc3 e6 5.g4 Bg6 6.Nge2 c5 7.h4 h6 8.Be3 Nc6`

- **c6** — Solid: prepare ...d5 to challenge the center.
- **d5** — Strike at e4 and enter Caro-Kann main lines.
- **Bf5** — Develop the bishop outside the chain before ...e6.
- **e6** — Reinforce d5 (now also hit by Nc3) and complete the setup.
- **Bg6** — Retreat down the diagonal, keeping the bishop active and ready for ...c5.
- **c5** — Counterstrike the d4 base of the chain before White consolidates.
- **h6** — Secure the h7 retreat for the bishop and give the king luft against g5 ideas.
- **Nc6** — Develop with pressure, piling up on the d4 pawn.

### 4.h4 h6 main line

`1.e4 c6 2.d4 d5 3.e5 Bf5 4.h4 h6 5.g4 Bd7 6.h5 c5 7.c3 Nc6 8.Be3 Qb6`

- **c6** — Solid: prepare ...d5.
- **d5** — Challenge e4.
- **Bf5** — Develop the bishop outside the chain.
- **h6** — Stop g4-g5 and the h5 trap, preserving a retreat for the f5-bishop.
- **Bd7** — Retreat to d7 to avoid being shut in; reroute via ...c5 and ...Nc6.
- **c5** — Hit d4 immediately to exploit White's loosened kingside.
- **Nc6** — Develop and add a second attacker to d4.
- **Qb6** — Pressure b2 and pile up on d4, exploiting White's neglected queenside.

### 4.Be3 quiet setup

`1.e4 c6 2.d4 d5 3.e5 Bf5 4.Be3 e6 5.Nd2 Nd7 6.Ngf3 Ne7 7.Be2 Ng6 8.O-O Be7`

- **c6** — Solid: prepare ...d5.
- **d5** — Challenge e4.
- **Bf5** — Develop the bishop outside the chain.
- **e6** — Solid central support; build the standard ...Nd7/...Ne7-g6 structure.
- **Nd7** — Flexible development aiming at ...Ne7/...Ng6 and ...c5.
- **Ne7** — Head for g6 to attack the e5 pawn.
- **Ng6** — Press e5 and gain kingside space.
- **Be7** — Complete development; prepare ...O-O and the ...c5 break.

### 4.c3 slow setup

`1.e4 c6 2.d4 d5 3.e5 Bf5 4.c3 e6 5.Be2 Nd7 6.Nf3 Ne7 7.O-O Ng6 8.Nbd2 Be7`

- **c6** — Solid: prepare ...d5.
- **d5** — Challenge e4.
- **Bf5** — Develop the bishop outside the chain.
- **e6** — Support d5 and start the standard ...Nd7/...Ne7-g6 plan.
- **Nd7** — Develop flexibly toward ...Ne7 and ...c5.
- **Ne7** — Route the knight to g6 against e5.
- **Ng6** — Attack e5 and grab kingside space.
- **Be7** — Complete development; prepare ...O-O and ...c5.

## exchange — confidence: high

**Verifier notes:**
- _minor_: Line E (4.Nf3 Nc6 5.Bb5 a6 6.Bxc6+ bxc6) is sound and intentional (bishop pair) but concedes doubled c-pawns; 5...Bd7 keeps structure intact. Kept as-is since the chapter explicitly frames it as the bishop-pair try and it is fully reputable.
- _minor_: Repertoire identity is stated as Classical ...Bf5, but the Exchange chapter correctly uses ...Bg4 (after 4.Bd3, ...Bf5 invites Bxf5). This is the standard treatment, not an inconsistency.

### Main line: 4.Bd3 6.Bf4 7.Qb3 — classical ...Na5

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6 6.Bf4 Bg4 7.Qb3 Na5 8.Qa4+ Bd7`

- **c6** — Caro-Kann: prepare ...d5 on a solid base
- **d5** — Challenge the center immediately
- **cxd5** — Recapture; sound symmetrical structure with easy development
- **Nc6** — Develop and pressure d4
- **Nf6** — Develop and contest the e4/e5 squares
- **Bg4** — Activate the light-squared bishop before ...e6 locks it in
- **Na5** — Hit the queen and, from a5, cover b7 against Qxb7
- **Bd7** — Block with tempo (attacks Qa4); reroute the knight via c6 and play ...e6

### 4.Bd3 with 6.Nf3

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6 6.Nf3 Bg4 7.h3 Bh5 8.O-O e6`

- **c6** — Caro-Kann: prepare ...d5 on a solid base
- **d5** — Challenge the center immediately
- **cxd5** — Recapture; symmetrical structure with free piece play
- **Nc6** — Develop and pressure d4
- **Nf6** — Develop and contest e4
- **Bg4** — Pin the f3-knight against the queen
- **Bh5** — Keep the pin and the bishop's activity
- **e6** — Finish development; prepare ...Bd6 and ...O-O

### 4.Bd3 6.Bf4 Bg4 7.Nf3 (no Qb3)

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6 6.Bf4 Bg4 7.Nf3 e6 8.O-O Bd6`

- **c6** — Caro-Kann: prepare ...d5 on a solid base
- **d5** — Challenge the center immediately
- **cxd5** — Recapture; symmetrical structure with free piece play
- **Nc6** — Develop and pressure d4
- **Nf6** — Develop and contest e4
- **Bg4** — Activate the light bishop before ...e6
- **e6** — Prepare ...Bd6 to challenge the f4-bishop
- **Bd6** — Offer to trade off White's active dark-squared bishop

### 4.Nf3 (5.c3 transposing to the main setup)

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Nf3 Nc6 5.c3 Nf6 6.Bd3 Bg4 7.Qb3 Na5 8.Qa4+ Bd7`

- **c6** — Caro-Kann: prepare ...d5 on a solid base
- **d5** — Challenge the center immediately
- **cxd5** — Recapture; symmetrical structure with free piece play
- **Nc6** — Develop and hit d4
- **Nf6** — Develop and contest e4
- **Bg4** — Pin the f3-knight
- **Na5** — Hit the queen and cover b7
- **Bd7** — Block with tempo; the knight returns via c6

### 4.Nf3 5.Bb5 (independent try)

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Nf3 Nc6 5.Bb5 a6 6.Bxc6+ bxc6 7.O-O Bg4 8.h3 Bh5`

- **c6** — Caro-Kann: prepare ...d5 on a solid base
- **d5** — Challenge the center immediately
- **cxd5** — Recapture; symmetrical structure with free piece play
- **Nc6** — Develop and hit d4
- **a6** — Question the pinning bishop at once
- **bxc6** — Recapture toward the center and take the bishop pair
- **Bg4** — Develop actively and pin the f3-knight
- **Bh5** — Maintain the pin; the bishop pair gives long-term play

### 4.c3 (slow) — Black develops normally

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c3 Nc6 5.Bd3 Nf6 6.Nf3 Bg4 7.O-O e6 8.Re1 Bd6`

- **c6** — Caro-Kann: prepare ...d5 on a solid base
- **d5** — Challenge the center immediately
- **cxd5** — Recapture; symmetrical structure with free piece play
- **Nc6** — Develop and pressure d4
- **Nf6** — Develop and eye e4
- **Bg4** — Pin the f3-knight
- **e6** — Complete development, prepare ...Bd6
- **Bd6** — Develop the bishop and castle next

### 4.Bf4 (early) — transposes to the main line

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bf4 Nc6 5.Bd3 Nf6 6.c3 Bg4 7.Qb3 Na5 8.Qa4+ Bd7`

- **c6** — Caro-Kann: prepare ...d5 on a solid base
- **d5** — Challenge the center immediately
- **cxd5** — Recapture; symmetrical structure with free piece play
- **Nc6** — Develop and pressure d4
- **Nf6** — Develop and eye e4
- **Bg4** — Activate the bishop before ...e6
- **Na5** — Hit the queen and guard b7
- **Bd7** — Block with tempo; transposes to the classical main line

## panov — confidence: high

**Verifier notes:**
- _minor_: No defects found. All six lines were machine-replayed from 1.e4: every SAN is strictly legal for its position, side alternation (w/b) is correct throughout, and all lines reach Black's 8th move as targeted.
- _minor_: Identity note: the stated repertoire identity is 'Classical Caro-Kann ...Bf5', but that applies to 3.Nc3/3.Nd2 lines, not the Panov (which arises via 3.exd5). Using the ...e6/...Bb4 (and ...Be7 vs 6.Bg5) setup here is the correct, reputable Panov approach and does not conflict with the Classical identity. No change made.

### Main: 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Bd2

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Bd2 Nc6`

- **c6** — Caro-Kann: prepare ...d5 to strike the center without blocking the c8-bishop.
- **d5** — Challenge e4 immediately; head for the Panov structure.
- **cxd5** — Recapture, reaching the Panov-Botvinnik pawn structure.
- **Nf6** — Canonical: develop and pressure d5/c4 at once.
- **e6** — Solid; supports d5 and frees the f8-bishop for ...Bb4.
- **Bb4** — Pin the c3-knight, increasing pressure on d5/d4 and the center.
- **Nxd5** — Recapture and centralize; the knight on d5 eyes c3 (still pinned).
- **Nc6** — Develop with tempo against d4; prepare ...O-O keeping the b4-bishop active.

### 5.Nc3 e6 6.Bg5

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Bg5 Be7 7.Nf3 O-O 8.Rc1 dxc4`

- **c6** — Caro-Kann move order toward ...d5.
- **d5** — Strike the center.
- **cxd5** — Reach the Panov structure.
- **Nf6** — Develop, pressure c4/d5.
- **e6** — Stay in the solid ...e6 setup.
- **Be7** — Support f6 and prepare quick castling (here ...Bb4 is less natural).
- **O-O** — King safety before resolving the central tension.
- **dxc4** — Hand White an isolated d4-pawn to blockade and attack with ...Nc6/...b6/...Bd7.

### 5.Nc3 e6 6.Nf3 Bb4 7.Bd3

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.Bd3 dxc4 8.Bxc4 O-O`

- **c6** — Caro-Kann setup.
- **d5** — Contest the center.
- **cxd5** — Panov structure.
- **Nf6** — Develop and pressure c4/d5.
- **e6** — Support d5, prepare ...Bb4.
- **Bb4** — Pin Nc3 and pressure the center.
- **dxc4** — Open the position and leave White with an isolated d-pawn.
- **O-O** — Castle; follow up with ...Nc6/...b6/...Bd7 to blockade and besiege d4.

### 5.Nc3 e6 6.Nf3 Bb4 7.a3

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.a3 Bxc3+ 8.bxc3 dxc4`

- **c6** — Caro-Kann setup.
- **d5** — Strike the center.
- **cxd5** — Panov structure.
- **Nf6** — Pressure c4/d5.
- **e6** — Solid; prepare ...Bb4.
- **Bb4** — Pin Nc3.
- **Bxc3+** — Trade off to damage White's queenside pawns.
- **dxc4** — Regain the pawn and target White's weak doubled c-pawns and IQP structure.

### 5.cxd5 Nxd5 6.Nf3

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.cxd5 Nxd5 6.Nf3 Nc6 7.Nc3 e6 8.Bc4 Be7`

- **c6** — Caro-Kann setup.
- **d5** — Contest the center.
- **cxd5** — Panov structure.
- **Nf6** — Develop and pressure c4/d5.
- **Nxd5** — Recapture and centralize the knight.
- **Nc6** — Hit White's isolated d4-pawn immediately.
- **e6** — Reinforce the d5-knight (e6-pawn covers d5) and keep the ...e6/...Be7 setup.
- **Be7** — Develop and prepare ...O-O, continuing to pressure the isolated d4-pawn.

### 5.cxd5 Nxd5 6.Nc3

`1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.cxd5 Nxd5 6.Nc3 e6 7.Nf3 Nc6 8.Bd3 Be7`

- **c6** — Caro-Kann setup.
- **d5** — Contest the center.
- **cxd5** — Panov structure.
- **Nf6** — Pressure c4/d5.
- **Nxd5** — Recapture, centralize.
- **e6** — Defend the centralized d5-knight (e6-pawn covers d5) and keep the ...e6 structure.
- **Nc6** — Develop and pressure d4.
- **Be7** — Complete development, ready to castle and play against White's d4-pawn.

## classical — confidence: high

### Main Line (6.h4 7.Nf3)

`1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6`

- **c6** — Solid: prepare ...d5 to challenge the center without shutting in the c8-bishop.
- **d5** — Strike at the center, the heart of the Caro-Kann.
- **dxe4** — Capture to enter the Classical main lines with a free light bishop.
- **Bf5** — The Classical move: develop the bishop outside the pawn chain before ...e6.
- **Bg6** — Keep the good bishop, sidestepping the trade and the knight's attack.
- **h6** — Give the bishop the h7 retreat and stop h5-h6 ideas trapping it.
- **Nd7** — Develop flexibly, preparing ...Ngf6 and supporting ...c5/...e5 breaks.
- **Bh7** — Tuck the bishop safely on h7; it can re-emerge after ...Bxd3.
- **Bxd3** — Trade light bishops, easing the slight space disadvantage.
- **e6** — Complete the structure, open the f8-bishop's diagonal, and prepare ...Ngf6 and queenside castling.

### 6.Nf3 (transposes)

`1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.Nf3 Nd7 7.h4 h6 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6`

- **c6** — Solid: prepare ...d5 without blocking the c8-bishop.
- **d5** — Challenge the center at once.
- **dxe4** — Enter the Classical lines.
- **Bf5** — Develop the light bishop actively before ...e6.
- **Bg6** — Retreat keeping the bishop, avoiding the trade.
- **Nd7** — Develop and stay flexible; this transposes once White plays h4.
- **h6** — Make the h7 retreat for the bishop and blunt h5-h6.
- **Bh7** — Safe square for the bishop.
- **Bxd3** — Exchange the light-squared bishops.
- **e6** — Solidify and prepare ...Ngf6, ...Qc7 and long castling.

### 6.Bc4

`1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.Bc4 e6 7.N1e2 Bd6 8.h4 h6`

- **c6** — Prepare ...d5 the Caro-Kann way.
- **d5** — Strike the center.
- **dxe4** — Take into the Classical main lines.
- **Bf5** — Classical development of the bishop.
- **Bg6** — Keep the strong bishop.
- **e6** — Blunt the bishop's aim at f7 and free the f8-bishop.
- **Bd6** — Active bishop eyeing g3/h2, preparing ...Ne7, ...Nd7 and castling.
- **h6** — Give the g6-bishop the h7 square and restrain h5.

### 3.Nd2 move order (transposes)

`1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7`

- **c6** — Solid Caro-Kann setup.
- **d5** — Challenge the center.
- **dxe4** — Capture; after Nxe4 this transposes straight into the Classical.
- **Bf5** — The Classical ...Bf5, same as versus 3.Nc3.
- **Bg6** — Keep the bishop, declining the trade.
- **h6** — Prepare the h7 retreat and stop h5-h6.
- **Nd7** — Flexible development; identical structures to the 3.Nc3 main line.
- **Bh7** — Tuck the bishop on h7, ready for ...Bxd3 and ...e6.

## sidelines — confidence: high

### (a) 2.Nf3

`1.e4 c6 2.Nf3 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.h5 Bh7`

- **c6** — Caro-Kann: challenge e4 while keeping a sound pawn structure.
- **d5** — Strike the center immediately.
- **dxe4** — Capture, steering into the Classical setup.
- **Bf5** — Classical Caro: develop the bishop outside the pawn chain before ...e6.
- **Bg6** — Retreat keeping the good bishop on its diagonal.
- **h6** — Make luft for the bishop and stop the h4-h5-h6 trap.
- **Bh7** — Tuck the bishop on h7; it stays strong while Black finishes with ...Nd7, ...e6, ...Ngf6.

### (b) Two Knights 2.Nc3 d5 3.Nf3

> **Note:** unified with the 2.Nf3 line — `2.Nc3 d5 3.Nf3` and `2.Nf3 d5 3.Nc3`
> transpose to the *same* position, which (per the single-canonical-reply rule) must
> have one Black answer. Both now follow the `...dxe4`/`...Bf5` plan, consistent with
> the Classical identity. The drafted independent `...Bg4` line was dropped to resolve
> the conflict. **Worth your review:** if you prefer the `...Bg4` treatment, we'd keep
> only one of the two move orders to avoid the transposition clash.

`1.e4 c6 2.Nc3 d5 3.Nf3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.h5 Bh7`

- **c6** — Solid: prepare ...d5.
- **d5** — Strike at e4.
- **dxe4** — Capture; after Nxe4 the light bishop comes to f5 (the Caro-Kann idea).
- **Bf5** — Develop the bishop outside the chain and hit the knight.
- **Bg6** — Retreat, keeping the bishop on the b1-h7 diagonal.
- **h6** — Make luft for the bishop before h5 traps it.
- **Bh7** — Tuck the bishop away; it stays a long-term asset.

### (c) 2.c4

`1.e4 c6 2.c4 d5 3.exd5 cxd5 4.cxd5 Nf6 5.Nc3 Nxd5 6.Nf3 Nc6 7.Bc4 e6`

- **c6** — Caro-Kann.
- **d5** — Hit the center before White builds a big pawn front.
- **cxd5** — Recapture, keeping a healthy pawn on d5.
- **Nf6** — Attack the d5-pawn and prepare to regain it with a centralized knight.
- **Nxd5** — Regain the pawn with an active knight; the structure is symmetrical and equal.
- **Nc6** — Develop and complete mobilization, controlling key central squares.
- **e6** — Solidify d5 (the queen covers the knight), open the bishop and prepare ...Be7 and ...O-O.

### (d) Fantasy 2.d4 d5 3.f3

`1.e4 c6 2.d4 d5 3.f3 e6 4.Nc3 Bb4 5.a3 Bxc3+ 6.bxc3 dxe4 7.fxe4 c5`

- **c6** — Caro-Kann.
- **d5** — Classical central challenge.
- **e6** — Solid French-like setup, staying sound against White's f3 plan.
- **Bb4** — Pin the knight and pressure e4 before White consolidates.
- **Bxc3+** — Capture, doubling White's pawns and weakening the center.
- **dxe4** — Open the position to target White's loose center and the weak e4-pawn.
- **c5** — Strike at d4, opening lines against White's compromised queenside pawns.

