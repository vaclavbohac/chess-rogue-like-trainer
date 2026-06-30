# Caro-Kann Roguelike — Design Spec

> A roguelike trainer for drilling the Caro-Kann Defense (Black). Survive a gauntlet
> of opening lines by playing the one correct repertoire move each turn. A non-book
> move costs a Heart; run out of Hearts and the Run is over — back to the start.

Status: **AGREED** (design grilled & locked). Platform/tech intentionally undecided
(see §10). Terminology is defined in [CONTEXT.md](./CONTEXT.md); the learning-model
decision is recorded in [docs/adr/0001](./docs/adr/0001-progressive-depth-ramp-no-practice-mode.md).

---

## 1. Vision

A focused practice tool disguised as a roguelike. Each session is a **Run**: a
**Gauntlet** of consecutive **Encounters** (opening lines) played back-to-back against
an opponent who plays real main lines. You must answer each position with *the* book
move. Mistakes cost Hearts; permadeath (back to the start) creates the pressure that
makes the lines stick. There is no separate practice mode — **you learn by playing**,
via immediate reveal-on-mistake, on a book that **unlocks progressively** so early
runs are learnable.

Goals: durable, reflexive recall of one Caro-Kann repertoire under pressure; make
repetition feel like progress; surface weak lines.

Non-goals (v1): not a general chess engine; opening repertoire only (no middlegame/
endgame); not multiplayer.

---

## 2. Core Loop

```
Start Run (current Tier, 3 Hearts)
   │
   ▼
For each Encounter in the Gauntlet (one per unlocked variation, random order):
   │
   ├─► White plays a book move (weighted-random at branch points)
   │        │
   │        ▼
   │   You play Black's reply
   │        │
   │   ┌────┴─────────────┐
   │ book move        non-book move
   │   │                  │
   │   ▼                  ▼
   │ continue       lose a Heart, reveal correct move + idea,
   │   │            reset to the position, you replay it
   │   │                  │
   │   ▼             Hearts == 0 ? ── yes ──► PERMADEATH ──► back to Encounter 1
   │ reach "out of book"  │                                  (full Hearts)
   │   │                  no ──► continue
   │   ▼
   │ ENCOUNTER CLEARED ──► next Encounter
   ▼
All Encounters cleared ──► RUN WON ──► next Tier unlocks
```

---

## 3. Roguelike Mechanics (locked)

| Element | Decision |
|---|---|
| **Run** | A fixed-length **Gauntlet** of **Encounters**, sharing one Heart pool. Beatable: clear all encounters → Run won. |
| **Encounter** | One opening line, start position → out of book. |
| **Gauntlet composition** | **Coverage-guaranteed**: each unlocked variation appears exactly once per run, random order (no dodging weak lines). Size grows with tier (~6 → ~15). |
| **Hearts** | **Fixed 3**, no regen within a run, full reset each new run. (Future difficulty toggle, not tier-scaled.) |
| **Mistake** | A *legal* move not equal to the position's single canonical book move. Illegal input is rejected, not penalized. |
| **Mistake handling** | **Retry-in-place**: −1 Heart, reveal correct move + idea immediately, reset to the position, replay. A decision point costs ≤1 Heart per run. |
| **Permadeath** | Hearts → 0 ends the Run; restart at Encounter 1 of the **current tier** with full Hearts. |
| **Win** | Survive the whole Gauntlet → Run won → next Tier unlocks. |
| **Mode** | Single mode only — no practice/free-play mode. |

---

## 4. Chess Content (the Book)

- Player is **Black** (`1.e4 c6`). White's first moves are fixed by the opening; the
  branching starts at White's 2nd/3rd move.
- **Backbone: Classical Caro-Kann** — `4...Bf5` vs `3.Nc3/3.Nd2 dxe4 4.Nxe4`, with
  `...Bf5` also in the Advance, for a coherent "bishop-out" identity.
- **One canonical Black move per position.** White may have **multiple weighted
  tries** (weights = real-world frequency); that is the *only* branching, and weighted
  random applies at deeper White branch points within an encounter.
- Final depth: **~Black move 10** (out of opening into a normal middlegame structure).
- Each Black node carries a one-line **idea** shown as feedback — this is where the
  learning happens (and the only teacher, since there's no practice mode).
- Authored by the project; **reviewed by the user** for chess correctness before it
  becomes the source of truth.

### Variations (Black repertoire after the relevant White try)
1. **Advance** `3.e5` — `...Bf5` lines.
2. **Exchange** `3.exd5 cxd5` — `4.Bd3 Nc6` etc.
3. **Classical / Two Knights** `3.Nc3/3.Nd2 dxe4 4.Nxe4 Bf5`.
4. **Panov-Botvinnik** `3.exd5 cxd5 4.c4`.
5. **Sidelines** — `2.Nf3`, `2.c4`, fantasy `3.f3` (introduced at the top tier).

### Repertoire data model (platform-agnostic)
A tree/DAG of positions keyed by FEN (so transpositions merge):

```
Node:
  - fen, sideToMove
  - if White to move:  whiteTries: [ { move, weight, child } ]   # weighted-random pick
  - if Black to move:  bookMove: <SAN>          # the single canonical reply
                       idea:     <one-line text>
  - isLeaf: true at out-of-book depth → ENCOUNTER CLEARED
  - tier: smallest tier at which this node is active (for the depth ramp)
```

---

## 5. Depth Ramp (Tiers)

Progressive unlock is the sole onboarding (see ADR-0001). Cumulative gauntlet; unlock
on a **single clear** of the current tier.

| Tier | Adds | Black depth | Gauntlet size |
|------|------|-------------|---------------|
| 1 | Advance, Exchange | to move ~5 | ~6 |
| 2 | + Classical / Two Knights | to move ~6 | ~9 |
| 3 | + Panov | to move ~8 | ~12 |
| 4 | + sidelines | to move ~10–12 | ~15 |

(Exact per-tier depths finalized during authoring.)

---

## 6. Feedback & Learning Aids

- **Correct move:** brief confirmation + the node's idea.
- **Mistake:** −1 Heart, reveal correct move + idea, reset, replay (§3).
- **End-of-encounter:** "cleared", advance.
- **Permadeath:** run-over screen, where it ended, restart at tier's Encounter 1.
- **Run won:** congratulations + next tier unlocked.
- Hint mechanic and hint-escalation on repeated misses: **deferred** (v2 toggle).

---

## 7. Persistence & Meta-Progression

- **Unlock state** (current tier) — persisted from v1 (required by the ramp).
- **Stats**: per-position `{seen, mistakes, lastSeenRunIndex}` — recorded from v1.
- Built later on that data: **weak-spot end-of-run report**, **adaptive weighting**
  (bias sub-branch frequency toward failed positions). Data captured now to avoid a
  cold start.
- Storage mechanism: TBD with platform (local store of some kind).

---

## 8. UI / UX Requirements (platform-agnostic)

Must: show the position (Black's perspective); accept a legal move (drag/click or
type); show Hearts remaining, current Encounter # / Gauntlet size, and Tier; give
immediate unambiguous correct/incorrect feedback with the idea; distinguish
Encounter-cleared / Run-won / Permadeath; show the moves so far.

Nice-to-have: last-move highlight, legal-target hints, move list per encounter.

---

## 9. Validation Rules

- Input must be a **legal** move; illegal input is an input error, **not** a Mistake.
- A legal-but-non-canonical move is the Mistake that costs a Heart.
- The opponent only ever plays moves defined in the Book.

---

## 10. Open Questions / Decisions

**Resolved (this design pass):**
- Run scope → multi-encounter Gauntlet (B).  [Q1]
- Beatable, fixed-length ~10–15 (A).  [Q2]
- Mistake handling → retry-in-place, immediate reveal (A).  [Q3]
- Single mode, pure permadeath, learn-by-playing (C).  [Q4 / ADR-0001]
- Progressive unlock depth ramp (A).  [Q5 / ADR-0001]
- Cumulative gauntlet, unlock on single clear; 4 tiers.  [Q6]
- Hearts: fixed 3.  [Q7]
- One canonical Black move per position.  [Q8]
- Coverage-guaranteed variations + frequency-weighted sub-branches.  [Q9]
- Persist unlock state + per-position stats from v1.  [Q10]
- Backbone Classical `4...Bf5`, depth ~move 10, user reviews content.  [Q11]

**Still open:**
1. ~~Platform & tech~~ → **RESOLVED: offline-capable PWA** (see ADR-0002). Static web
   app, installable on phone + runs on desktop, service-worker offline cache, local
   persistence, no backend. Stack: chess.js (rules) + chessground (board).
   **Hosting: GitHub Pages. Progress: per-device, no sync.**
2. **Run-won loop** — after winning a tier, auto-roll into the next tier's gauntlet,
   or return to a menu? (Minor; default: show unlock, offer "next tier" / "replay".)
3. **Exact per-tier depths & the concrete move choices** — settled during authoring,
   then user-reviewed.

---

## 11. Suggested Build Phases (once tech is chosen)

1. **M0 — Engine core (no UI):** repertoire tree model, legal-move check, canonical
   book-move check, Hearts/Run/Gauntlet state machine, coverage-guaranteed gauntlet
   builder, weighted sub-branch selection, tier gating, persistence of unlock+stats.
2. **M1 — Playable Tier 1:** Advance + Exchange end-to-end with the chosen UI; hearts,
   retry-in-place reveal, encounter-cleared / run-won / permadeath states.
3. **M2 — Full ramp:** author & wire Tiers 2–4 (all §4 variations), user review.
4. **M3 — Training analytics:** weak-spot report + adaptive weighting off the stats.
5. **M4 — Polish:** hint toggle, run summaries, difficulty toggles (e.g. heart count),
   optional relics/checkpoints.
