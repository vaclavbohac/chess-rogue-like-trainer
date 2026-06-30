import { compileBook } from "./engine/book";
import { buildRepertoireTree, MAX_TIER } from "./engine/repertoire";
import { makeRng } from "./engine/rng";
import { Run } from "./engine/run";
import {
  loadProgress,
  recordDecision,
  saveProgress,
  startRun,
  type KeyValueStore,
} from "./engine/persistence";

// M0 placeholder UI. The real board (chessground) + interaction arrives in M1.
// For now we prove the engine + persistence are wired and offline-ready.

const store: KeyValueStore = window.localStorage;
const progress = loadProgress(store);
const runIndex = startRun(progress);
saveProgress(store, progress);

const book = compileBook(buildRepertoireTree());
const run = new Run(book, {
  tier: Math.min(progress.tier, MAX_TIER),
  rng: makeRng(runIndex || 1),
  onDecision: (e) => {
    recordDecision(progress, e);
    saveProgress(store, progress);
  },
});

const view = run.view();
const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <main style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem;">
    <h1>Caro-Kann Roguelike Trainer</h1>
    <p><strong>M0 engine core wired.</strong> Board UI lands in M1.</p>
    <ul>
      <li>Tier: ${view.tier}</li>
      <li>Hearts: ${"♥".repeat(view.hearts)}</li>
      <li>Encounter: ${view.encounterNumber} / ${view.gauntletSize}</li>
      <li>Variation: ${view.variation?.name ?? "—"}</li>
      <li>Variations unlocked: ${book.variations.filter((v) => v.tier <= view.tier).length}</li>
      <li>Runs started: ${runIndex}</li>
    </ul>
    <p style="color:#666">FEN: <code>${view.fen}</code></p>
  </main>
`;
