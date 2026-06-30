# Caro-Kann Roguelike

A roguelike-flavored trainer for drilling the Caro-Kann Defense (Black). The player
survives by answering with repertoire moves; mistakes cost lives; permadeath resets
progress. This document defines the shared language of the project.

## Language

**Run**:
One full roguelike attempt — a **Gauntlet** of consecutive **Encounters** played
back-to-back, sharing one pool of **Hearts**. Ends in victory (gauntlet cleared) or
permadeath (hearts exhausted), after which you start over from the first encounter.
There is a **single mode** (no separate practice mode): the player learns by playing,
relying on the reveal-on-mistake (see **Mistake**) as the teaching mechanism.
_Avoid_: game, session, playthrough.

**Gauntlet**:
The series of **Encounters** that make up one **Run**. Built with a **coverage
guarantee**: each unlocked variation appears as exactly one **Encounter** per run, in
random order (the player cannot dodge weak variations). Run-to-run variety comes from
**weighted-random** White choices at deeper branch points within an encounter (weights
= real-world frequency).

**Encounter**:
A single opening line played from the start position to the end of book ("out of
book"). The unit a **Gauntlet** is composed of. A **Gauntlet** is fixed-length
(~10–15 encounters); surviving all of them wins the **Run**.
_Avoid_: line (ambiguous — see below), level, room.

**Heart**:
One unit of the per-**Run** mistake budget. The pool is a **fixed 3**, no regen
within a run, fully reset at the start of each new run. Persists across **Encounters**
within a run. Reaching zero is permadeath. (Heart count is a candidate future
difficulty toggle / meta-upgrade, not scaled per tier.)
_Avoid_: life (acceptable as synonym, but prefer Heart in code/UI).

**Mistake**:
Playing a legal move that is not in the repertoire for the current position. Costs a
**Heart**. An *illegal* move is rejected as input error and is NOT a mistake.
Handling is **retry-in-place**: the correct move + its idea are revealed immediately,
the board resets to before the mistake, and the player plays the correct move to
continue. A given decision point therefore costs at most one **Heart** per encounter.

**Book / Repertoire**:
The authored tree of correct Black replies (and weighted White tries) that defines
what counts as correct. The single source of truth for "optimal". Each Black position
has exactly **one canonical correct move**; any other legal move is a **Mistake**.
White positions may have **multiple weighted tries** (this is the only branching).
Backbone: **Classical Caro-Kann** (`4...Bf5` vs `3.Nc3/3.Nd2 dxe4 4.Nxe4`), final
depth ~Black move 10. Authored by the project, **reviewed by the user** for chess
correctness before becoming the source of truth.

**Tier**:
A stage of the **depth ramp**: the subset of the **Book** (which variations, and how
deep) that is currently active for a **Run**. Clearing a tier's **Gauntlet** unlocks
the next, wider/deeper tier. The earliest tier is narrow and shallow.

**Unlock state**:
The persisted record of which **Tier** the player has reached. Persistence is in
scope from v1 (at minimum to store this).

**Stats**:
Persisted per-position history (`positionId → {seen, mistakes, lastSeenRunIndex}`),
recorded from v1. Raw material for a future weak-spot report and adaptive Q9
weighting; captured immediately to avoid a cold start even before those features ship.

## Relationships

- A **Run** contains an ordered **Gauntlet** of many **Encounters**.
- A **Run** has one pool of **Hearts** shared across all its **Encounters**.
- An **Encounter** is one path through the **Book** from root to a leaf.
- Permadeath ends the **Run** and resets the **Gauntlet** to its first **Encounter**.

## Flagged ambiguities

- "Run" originally meant a single opening line in the draft spec. Resolved: a Run is
  a multi-encounter gauntlet; a single opening line is an **Encounter**.
- "Line" is avoided as a primary term because it conflates "an opening variation" with
  "one encounter instance". Use **Encounter** for the played instance, "variation" for
  the named opening (Advance, Panov, …).
