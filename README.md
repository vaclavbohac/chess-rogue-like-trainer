# chess-rogue-like-trainer

A roguelike-flavored trainer for drilling the **Caro-Kann Defense** (Black).

Survive a *gauntlet* of opening lines by playing the one correct repertoire move each
turn. A non-book move costs a **Heart**; run out of Hearts and the run is over — back
to the start. The book **unlocks progressively** (a depth ramp) so you learn by
playing, and the whole thing runs **offline on your phone and computer** as an
installable PWA — usable on a flight.

## Status

Design phase complete; implementation not started. See the design docs:

- [`SPEC.md`](./SPEC.md) — full design spec (status: AGREED).
- [`CONTEXT.md`](./CONTEXT.md) — glossary / shared language.
- [`docs/adr/`](./docs/adr/) — architecture decision records:
  - [0001](./docs/adr/0001-progressive-depth-ramp-no-practice-mode.md) — progressive depth ramp as the sole onboarding (no practice mode).
  - [0002](./docs/adr/0002-offline-pwa.md) — offline-capable PWA for phone + desktop.

## Planned stack

Static, offline-first **PWA** — `chess.js` (rules) + `chessground` (board), service-worker
cached, local per-device persistence, no backend. Hosted on **GitHub Pages**.
