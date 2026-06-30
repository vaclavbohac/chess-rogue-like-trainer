---
status: superseded by ADR-0003
---

# Progressive depth ramp as the sole onboarding (no practice mode)

> **Superseded by [ADR-0003](0003-hades-run-through-all-tiers.md).** The progressive
> tier-unlock ramp is replaced by a Hades-style run that traverses all tiers each run,
> with a points/shop economy. The *single pure-permadeath mode* and *learn-by-playing
> via reveal-on-mistake* decisions below still hold; only the unlock mechanism changed.

The trainer runs as a **single pure-permadeath mode** — there is no separate
practice/free-play mode. The risk this creates (a learner being tested on lines they
have never seen) is handled instead by a **progressive depth ramp**: the Book starts
narrow and shallow (Tier 1 ≈ 2 variations, ~4 Black moves deep) and unlocks more
variations and depth as the player clears each tier. The on-ramp *is* the ramp.

## Why

- A pure-permadeath loop with the full repertoire live from run #1 makes the first
  week a wall: every run dies early in lines never encountered, so the deeper lines
  are never reached. Rejected.
- A dedicated practice mode would solve learnability but was explicitly not wanted —
  the user wants to learn by playing, using reveal-on-mistake as the teacher.
- The depth ramp reconciles both: each tier is small enough to learn via reveals
  within a few runs, and unlocking depth/breadth doubles as roguelike
  meta-progression (a long content tail) without a second mode.

## Consequences

- Unlock state must be **persisted** across runs (forces persistence into v1 scope).
- The Gauntlet is **cumulative** (every unlocked variation reappears each run) and
  unlocks on a **single clear** of the current tier — so old lines are continuously
  re-tested without an explicit "N clean clears" gate.
