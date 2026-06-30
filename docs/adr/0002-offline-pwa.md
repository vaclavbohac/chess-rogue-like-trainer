# Offline-capable PWA for phone + desktop

The trainer is a **static, offline-first Progressive Web App**: one browser-based
codebase that installs to a phone home screen and runs on desktop, caches all assets
via a **service worker** for full offline use (the driving requirement: usable on a
flight), persists progress locally (localStorage/IndexedDB), and has **no backend or
runtime server**. Chess libraries are vendored locally (chess.js for rules,
chessground for the board) — no CDN at runtime.

## Why

- Requirements were "works on phone *and* computer" and "usable during a flight"
  (offline). A PWA is the only single-codebase option that satisfies both without a
  native app per OS or a reachable server.
- Vendoring libraries + static output sidesteps the old local Node v16 (build artifact
  is just static files) and guarantees nothing needs the network at runtime.

## Consequences

- **Must be installed/cached before going offline.** Service workers require **HTTPS**
  (so a bare `file://` won't enable offline-on-phone); the app must be served from an
  HTTPS URL at least once to install. **Hosting: GitHub Pages** (free HTTPS from the
  repo; open the URL on the phone once to install + cache).
- **Progress is per-device (independent), no sync** — chosen to keep the design pure
  offline with no backend. Phone and computer each track their own tier + stats. A
  sync layer is a possible later add-on, explicitly out of scope now.
- All repertoire data ships in the cached bundle (it is small), so the full Book is
  available offline.
