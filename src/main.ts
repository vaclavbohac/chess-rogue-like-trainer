import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import "./style.css";

import { Chess } from "chess.js";
import { compileBook } from "./engine/book";
import { buildRepertoireTree } from "./engine/repertoire";
import { makeRng } from "./engine/rng";
import { Run } from "./engine/run";
import {
  awardPoints,
  effectiveUpgrades,
  loadProgress,
  recordDecision,
  saveProgress,
  startRun,
  updateFurthestReach,
} from "./engine/persistence";
import { Board } from "./ui/board";
import { renderHome } from "./ui/home";

const store = window.localStorage;
const book = compileBook(buildRepertoireTree());
const progress = loadProgress(store);
const app = document.querySelector<HTMLDivElement>("#app")!;

// Markup for the Game view. Built fresh on each entry so leaving to Home and coming
// back (Start/Retry) always gets a clean board + overlay. The end overlay is a run
// summary with Home (primary) and Retry actions — themes/interstitial land in P3.
const GAME_HTML = `
  <div class="shell">
    <div class="hud">
      <span id="tier" class="pill"></span>
      <span id="enc" class="pill"></span>
      <span id="hearts" class="hearts"></span>
    </div>
    <div id="variation" class="variation"></div>
    <div class="board-wrap">
      <div id="board" class="cg-wrap"></div>
      <div id="overlay" class="overlay" hidden>
        <div class="overlay-card">
          <h2 id="overlay-title"></h2>
          <p id="overlay-sub"></p>
          <div class="overlay-actions">
            <button id="summary-home" class="btn">Home</button>
            <button id="summary-retry" class="btn btn-secondary">Retry</button>
          </div>
        </div>
      </div>
    </div>
    <div id="feedback" class="feedback">&nbsp;</div>
    <p class="note">You play <strong>Black</strong>. Play the book move — a wrong move costs a heart.</p>
  </div>
`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

let board: Board;
let run: Run;
let banked = false; // guard: a run's points are banked exactly once at its end

// Start on Home (Hades-style hub); Start Run takes the player into the Game view.
showHome();

function showHome(): void {
  renderHome(app, progress, store, { onStartRun: startGame });
}

/** Enter the Game view with a fresh board and a new Run. */
function startGame(): void {
  app.innerHTML = GAME_HTML;
  board = new Board($("#board"), onMove);
  $<HTMLButtonElement>("#summary-home").addEventListener("click", showHome);
  $<HTMLButtonElement>("#summary-retry").addEventListener("click", startGame);
  newRun();
}

function newRun(): void {
  banked = false;
  const idx = startRun(progress);
  saveProgress(store, progress);
  run = new Run(book, {
    rng: makeRng(idx),
    upgrades: effectiveUpgrades(progress),
    onDecision: (e) => {
      recordDecision(progress, e);
      saveProgress(store, progress);
    },
  });
  setFeedback("");
  render(false);
}

/** Bank the run's earned points and update the furthest-reach high-water mark (once). */
function bankRun(): void {
  if (banked) return;
  banked = true;
  const v = run.view();
  awardPoints(progress, v.points);
  updateFurthestReach(progress, { tier: v.tier, cleared: v.status === "won" });
  saveProgress(store, progress);
}

function onMove(from: string, to: string): void {
  if (run.view().status !== "awaiting-move") return;
  const res = run.submit({ from, to, promotion: "q" });

  if (res.type === "illegal") {
    render(false);
    return;
  }
  if (res.type === "correct") {
    if (res.runWon) bankRun(); // bank once, on the winning move
    setFeedback(res.idea, "good");
    render(!res.encounterCleared); // snap to a fresh board when a new encounter begins
    return;
  }
  // mistake
  setFeedback(`✗ correct was ${res.bookMove} — ${res.idea}`, "bad");
  if (res.dead) {
    bankRun();
    render(false);
  } else {
    render(true); // animate the wrong piece back, then show the hint arrow
  }
}

function render(animate = true): void {
  const v = run.view();
  $("#tier").textContent = v.venue;
  $("#enc").textContent = `Encounter ${v.encounterNumber}/${v.gauntletSize} · ${v.points} pts`;
  $("#variation").textContent = v.variation?.name ?? "";
  $("#hearts").textContent =
    "♥".repeat(v.hearts) + "♡".repeat(Math.max(0, v.maxHearts - v.hearts));

  const overlayEl = $<HTMLDivElement>("#overlay");
  if (v.status === "awaiting-move") {
    overlayEl.hidden = true;
    board.awaitBlackMove(v.fen, animate, !!v.revealedMove);
    if (v.revealedMove) {
      const { from, to } = sanToFromTo(v.fen, v.revealedMove);
      board.showHint(from, to);
    }
  } else {
    board.freeze(v.fen);
    showSummary(v.status);
  }
}

/** End-of-run summary: points earned this run + furthest reach this run. */
function showSummary(status: "won" | "dead"): void {
  const v = run.view();
  $<HTMLDivElement>("#overlay").hidden = false;
  if (status === "won") {
    $("#overlay-title").textContent = "Run cleared! 🎉";
    $("#overlay-sub").textContent =
      `Reached the final — every venue cleared. +${v.points} points this run · wallet ${progress.points}.`;
  } else {
    $("#overlay-title").textContent = "Out of hearts 💀";
    $("#overlay-sub").textContent =
      `Reached ${v.venue}. +${v.points} points this run · wallet ${progress.points}.`;
  }
}

function setFeedback(text: string, kind: "good" | "bad" | "" = ""): void {
  const feedbackEl = $("#feedback");
  feedbackEl.textContent = text || " ";
  feedbackEl.className = `feedback${kind ? " " + kind : ""}`;
}

function sanToFromTo(fen: string, san: string): { from: string; to: string } {
  const c = new Chess(fen);
  const m = c.move(san);
  return { from: m.from, to: m.to };
}
