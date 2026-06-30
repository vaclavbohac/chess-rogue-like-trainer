# Caro-Kann Roguelike

A roguelike-flavored trainer for drilling the Caro-Kann Defense (Black). The player
survives by answering with repertoire moves; mistakes cost lives; permadeath resets
progress. This document defines the shared language of the project.

## Language

**Run**:
One full roguelike attempt (Hades-style). A Run always **starts at Tier 1 and
traverses every Tier in sequence** (Tier 1 → … → the final Tier), playing each Tier's
**Encounters** on one shared pool of **Hearts**. Reaching the end of the last Tier
wins the Run ("reaching the final"); permadeath (hearts exhausted) ends it and sends
you back to **Tier 1**. **All Tiers are present in every Run from the start** — there
is no tier unlocking (supersedes ADR-0001). Single mode; the player learns by playing
via reveal-on-mistake (see **Mistake**).
_Avoid_: game, session, playthrough.

**Gauntlet**:
The full ordered sequence of **Encounters** in a **Run**, grouped into **Tiers**
(difficulty regions) and played easiest-first. Every Run includes **every variation**
(one **Encounter** each) — total coverage — ordered by Tier, with random order *within*
a Tier. Variety within an encounter still comes from **weighted-random** White choices
at deeper branch points (weights = real-world frequency).

**Encounter**:
A single opening line played from the start position to the end of book ("out of
book"). The unit a **Gauntlet** is composed of. A **Gauntlet** is fixed-length
(~10–15 encounters); surviving all of them wins the **Run**.
_Avoid_: line (ambiguous — see below), level, room.

**Heart**:
One unit of the per-**Run** mistake budget. The pool starts at a base of **3** and can
be raised by permanent **Upgrades** (max hearts). No regen within a run; fully reset to
the current max at the start of each new run. Persists across **Encounters** and
**Tiers** within a run. Reaching zero is permadeath.
_Avoid_: life (acceptable as synonym, but prefer Heart in code/UI).

**Points** *(currency)*:
The meta-progression currency. Earned by clearing **Encounters** (+1 each), with
bonuses for clearing a whole **Tier** and the whole **Run**. **Banked persistently**
across runs and spent in the **Shop**.

**Shop** *(the "Mirror")*:
Where banked **Points** buy permanent **Upgrades**. Lives on the **Home** screen
(between runs). Hades' Mirror of Night analogue.

**Upgrade**:
A permanent, purchased modifier bought in the **Shop**; persists across all future
runs. Catalog (all chosen to extend *reach*, never to ease an individual position):
- **+1 Max Heart** — repeatable, scaling cost, capped (~3 → 6).
- **Tier Heal** — regain 1 **Heart** each time a **Tier** is cleared (Hades biome heal).
- **Death Defiance** — once per run, survive a fatal **Mistake** with 1 **Heart**.
Deliberately **excluded**: hint / no-penalty-reveal upgrades — they remove the recall
effort that is the training.

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
A **difficulty region** within every **Run** (like a Hades biome), each presented as a
themed **Venue**. Each variation is assigned to a Tier as a difficulty band (Tier 1 =
easiest: Advance/Exchange; up to Tier 4 = sidelines). A Run traverses all Tiers in
order, easiest-first. Tiers are no longer a per-run scope or an unlock gate (supersedes
the depth-ramp in ADR-0001). Labelled by **Venue** name, not "Tier N".

**Theme / Venue**:
Each **Tier**'s visual identity and display label (Hades-biome style), escalating in
prestige: Tier 1 **The Pub**, Tier 2 **The Chess Club**, Tier 3 **The Tournament
Hall**, Tier 4 **The World Championship** (the climax). A theme = venue name + color
palette (page background + accent) + chessground board colors, built **CSS-only**
(gradients/palettes/small SVG, no heavy raster art) to keep the offline bundle small.
The **Game** screen wears the current Tier's theme; the **Interstitial** previews the
next venue.

**Furthest reach** *(persisted, replaces Unlock state)*:
The high-water mark of meta-progression: how far the player has gotten across runs
(deepest Tier/Encounter reached) and whether they have "reached the final" (cleared
the last Tier). Exact persisted shape and any post-clear difficulty escalation: TBD.

**Stats**:
Persisted per-position history (`positionId → {seen, mistakes, lastSeenRunIndex}`),
recorded from v1. Raw material for a future weak-spot report and adaptive Q9
weighting; captured immediately to avoid a cold start even before those features ship.

**Screens**:
The app has three views — **Home** (start a run, the **Shop**, points wallet, furthest
reach), **Game** (the board + run), and the **Interstitial** (a display-only pause
shown at each **Tier** boundary mid-run: tier path, hearts, points earned, any heal).
Within a **Tier**, encounter-to-encounter is seamless (no interstitial).

## Relationships

- A **Run** traverses all **Tiers** in order; each **Tier** holds its **Encounters**.
- A **Run** has one pool of **Hearts** shared across every **Tier** and **Encounter**.
- An **Encounter** is one path through the **Book** from root to a leaf.
- Permadeath ends the **Run** and resets it to **Tier 1**'s first **Encounter**.

## Flagged ambiguities

- "Run" originally meant a single opening line in the draft spec. Resolved: a Run is
  a multi-encounter gauntlet; a single opening line is an **Encounter**.
- "Line" is avoided as a primary term because it conflates "an opening variation" with
  "one encounter instance". Use **Encounter** for the played instance, "variation" for
  the named opening (Advance, Panov, …).
- "Stage" was used for what the glossary calls a **Tier** (the meta-progression unlock
  level). Resolved: use **Tier**; avoid "stage". (Within-run units are **Encounters**.)
