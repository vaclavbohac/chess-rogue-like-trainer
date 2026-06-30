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
import { VENUES, venueThemeClass } from "./engine/venues";
import { Board } from "./ui/board";
import { renderHome } from "./ui/home";
import { interstitialHtml } from "./ui/interstitial";

const store = window.localStorage;
const book = compileBook(buildRepertoireTree());
const progress = loadProgress(store);
const app = document.querySelector<HTMLDivElement>("#app")!;

// Markup for the Game view. Built fresh on each entry so leaving to Home and coming
// back (Start/Retry) always gets a clean board + overlay. The HUD is venue-first
// (CONTEXT.md): current venue + within-venue & overall progress + hearts + points.
// The single overlay is reused for both the between-tier Interstitial and the
// end-of-run summary (content built per state in render()).
const GAME_HTML = `
  <div class="shell game">
    <div class="hud">
      <div class="hud-row">
        <span id="venue" class="venue-label"></span>
        <span id="hearts" class="hearts"></span>
      </div>
      <div class="hud-row hud-progress">
        <span id="venue-progress" class="pill"></span>
        <span id="overall-progress" class="pill"></span>
        <span id="points" class="pill pill-accent"></span>
      </div>
    </div>
    <div id="variation" class="variation"></div>
    <div class="board-wrap">
      <div id="board" class="cg-wrap"></div>
      <div id="overlay" class="overlay" hidden>
        <div id="overlay-card" class="overlay-card"></div>
      </div>
    </div>
    <div id="feedback" class="feedback">&nbsp;</div>
    <p class="note">You play <strong>Black</strong>. Play the book move — a wrong move costs a heart.</p>
  </div>
`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const VENUE_THEME_CLASSES = VENUES.map((v) => v.themeClass);

let board: Board;
let run: Run;
let banked = false; // guard: a run's points are banked exactly once at its end
let showingInterstitial = false; // UI mode: a tier-boundary pause is on screen

// Start on Home (Hades-style hub); Start Run takes the player into the Game view.
showHome();

function showHome(): void {
  clearTheme(); // Home wears the neutral hub palette, not a venue theme.
  renderHome(app, progress, store, { onStartRun: startGame });
}

/** Enter the Game view with a fresh board and a new Run. */
function startGame(): void {
  app.innerHTML = GAME_HTML;
  board = new Board($("#board"), onMove);
  newRun();
}

function newRun(): void {
  banked = false;
  showingInterstitial = false;
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
  // The board is frozen behind the Interstitial, but guard anyway.
  if (showingInterstitial || run.view().status !== "awaiting-move") return;
  const res = run.submit({ from, to, promotion: "q" });

  if (res.type === "illegal") {
    render(false);
    return;
  }
  if (res.type === "correct") {
    if (res.runWon) bankRun(); // bank once, on the winning move
    setFeedback(res.idea, "good");
    // A mid-run tier boundary pauses on the Interstitial; the final tier is a win.
    if (res.tierCleared && !res.runWon) {
      showingInterstitial = true;
      render(false); // board has already advanced into the new venue's first encounter
      return;
    }
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

/** Dismiss the Interstitial and resume play in the new venue. */
function continueRun(): void {
  showingInterstitial = false;
  setFeedback("");
  render(false); // snap to the new venue's first position
}

function render(animate = true): void {
  const v = run.view();
  applyTheme(v.tier); // the Game (and the Interstitial) wears the current venue's theme
  updateHud(v);
  $("#variation").textContent = v.variation?.name ?? "";

  const overlayEl = $<HTMLDivElement>("#overlay");
  const cardEl = $<HTMLDivElement>("#overlay-card");

  if (v.status !== "awaiting-move") {
    board.freeze(v.fen);
    overlayEl.hidden = false;
    cardEl.innerHTML = summaryHtml(v.status, v);
    $<HTMLButtonElement>("#summary-home").addEventListener("click", showHome);
    $<HTMLButtonElement>("#summary-retry").addEventListener("click", startGame);
    return;
  }

  if (showingInterstitial) {
    board.freeze(v.fen); // preview the new venue's board behind the pause card
    overlayEl.hidden = false;
    cardEl.innerHTML = interstitialHtml(v);
    $<HTMLButtonElement>("#inter-continue").addEventListener("click", continueRun);
    return;
  }

  overlayEl.hidden = true;
  board.awaitBlackMove(v.fen, animate, !!v.revealedMove);
  if (v.revealedMove) {
    const { from, to } = sanToFromTo(v.fen, v.revealedMove);
    board.showHint(from, to);
  }
}

/** Venue-first HUD: venue name, within-venue & overall progress, hearts, points. */
function updateHud(v: ReturnType<Run["view"]>): void {
  $("#venue").textContent = v.venue;
  $("#hearts").textContent =
    "♥".repeat(v.hearts) + "♡".repeat(Math.max(0, v.maxHearts - v.hearts));
  $("#venue-progress").textContent = `This venue ${v.tierEncounterNumber}/${v.tierEncounterCount}`;
  $("#overall-progress").textContent = `Run ${v.encounterNumber}/${v.gauntletSize}`;
  $("#points").textContent = `${v.points} pts`;
}

/** End-of-run summary card: points earned this run + furthest reach this run. */
function summaryHtml(status: "won" | "dead", v: ReturnType<Run["view"]>): string {
  const title = status === "won" ? "Run cleared! 🎉" : "Out of hearts 💀";
  const sub =
    status === "won"
      ? `Reached the final — every venue cleared. +${v.points} points this run · wallet ${progress.points}.`
      : `Reached ${v.venue}. +${v.points} points this run · wallet ${progress.points}.`;
  return `
    <h2>${title}</h2>
    <p>${sub}</p>
    <div class="overlay-actions">
      <button id="summary-home" class="btn">Home</button>
      <button id="summary-retry" class="btn btn-secondary">Retry</button>
    </div>
  `;
}

/** Dress the page in a venue's theme (palette + board square colors). */
function applyTheme(tier: number): void {
  const cls = venueThemeClass(tier);
  if (document.body.classList.contains(cls)) return;
  document.body.classList.remove(...VENUE_THEME_CLASSES);
  document.body.classList.add(cls);
}

/** Drop any venue theme so Home shows the neutral hub palette. */
function clearTheme(): void {
  document.body.classList.remove(...VENUE_THEME_CLASSES);
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
