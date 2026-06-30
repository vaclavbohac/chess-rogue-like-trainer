---
status: accepted (supersedes 0001)
---

# Hades-style run: traverse all tiers each run, with a points/shop meta-economy

A **Run** no longer scopes to a single Tier and Tiers are no longer unlocked
progressively. Instead, **every Run starts at Tier 1 and traverses all Tiers in
sequence** (Tier 1 → … → Tier 4) on one shared **Heart** pool, easiest-first;
reaching the end of the last Tier wins the run, permadeath sends you back to Tier 1.
All Tiers are present from day one. Meta-progression is a **points economy**: clearing
**Encounters** earns **Points** (with Tier/Run-clear bonuses), banked persistently and
spent in a **Shop** on permanent **Upgrades** (+Max Heart, Tier Heal, Death Defiance).
Each Tier is a themed **Venue** (The Pub → The Chess Club → The Tournament Hall → The
World Championship).

This **supersedes ADR-0001** (progressive depth ramp / unlock-as-onboarding).

## Why

- The user wanted a Hades-shaped loop: always start from the beginning and fight
  through each region to reach the final. A per-tier-scoped run with cross-run
  unlocking can't express "go through each tier to reach the final" in one run.
- ADR-0001's depth ramp existed to keep pure-permadeath learnable. The Hades model
  preserves that goal by a different mechanism: a beginner naturally dies in early
  tiers and re-drills them via reveal-on-mistake until good enough to push deeper
  (skill-gated reach instead of explicit unlock), and the **Shop** lets a stuck player
  buy *reach* (more hearts, heal-on-tier, death-defiance) to get far enough to see and
  learn deeper tiers. So learnability survives without progressive unlocking.

## Consequences

- **No tier-unlock state.** Persistence shifts to: banked **Points**, purchased
  **Upgrades**, **Furthest reach**, and the existing per-position **Stats**.
- **Hearts** become a base (3) raised by Upgrades; the heart economy now spans a much
  longer (all-tiers) run — heal/defiance upgrades exist partly to balance that.
- Upgrades are deliberately **reach-extending only**; no hint / no-penalty-reveal
  upgrades, which would remove the recall effort that is the training.
- New screens: **Home** (start + Shop + wallet + furthest reach) and a per-Tier
  **Interstitial**; the **Game** screen is themed per current Venue.
