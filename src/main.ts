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

const store = window.localStorage;
const book = compileBook(buildRepertoireTree());
const progress = loadProgress(store);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="shell">
    <header><h1>Caro-Kann Trainer</h1></header>
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
          <button id="overlay-btn" class="btn"></button>
        </div>
      </div>
    </div>
    <div id="feedback" class="feedback">&nbsp;</div>
    <p class="note">You play <strong>Black</strong>. Play the book move — a wrong move costs a heart.</p>
  </div>
`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const tierEl = $("#tier");
const encEl = $("#enc");
const heartsEl = $("#hearts");
const varEl = $("#variation");
const feedbackEl = $("#feedback");
const overlayEl = $<HTMLDivElement>("#overlay");
const overlayTitle = $("#overlay-title");
const overlaySub = $("#overlay-sub");
const overlayBtn = $<HTMLButtonElement>("#overlay-btn");

const board = new Board($("#board"), onMove);
overlayBtn.addEventListener("click", newRun);

let run: Run;
newRun();

function newRun(): void {
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

/** Bank the run's earned points and update the furthest-reach high-water mark. */
function bankRun(): void {
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
  tierEl.textContent = v.venue;
  encEl.textContent = `Encounter ${v.encounterNumber}/${v.gauntletSize} · ${v.points} pts`;
  varEl.textContent = v.variation?.name ?? "";
  heartsEl.textContent =
    "♥".repeat(v.hearts) + "♡".repeat(Math.max(0, v.maxHearts - v.hearts));

  if (v.status === "awaiting-move") {
    overlayEl.hidden = true;
    board.awaitBlackMove(v.fen, animate, !!v.revealedMove);
    if (v.revealedMove) {
      const { from, to } = sanToFromTo(v.fen, v.revealedMove);
      board.showHint(from, to);
    }
  } else {
    board.freeze(v.fen);
    showOverlay(v.status);
  }
}

function showOverlay(status: "won" | "dead"): void {
  const v = run.view();
  overlayEl.hidden = false;
  if (status === "won") {
    overlayTitle.textContent = "Run cleared! 🎉";
    overlaySub.textContent = `You reached the final — every venue cleared. +${v.points} points banked (wallet: ${progress.points}).`;
    overlayBtn.textContent = "Next run";
  } else {
    overlayTitle.textContent = "Out of hearts 💀";
    overlaySub.textContent = `The run ends at ${v.venue}. +${v.points} points banked (wallet: ${progress.points}).`;
    overlayBtn.textContent = "Try again";
  }
}

function setFeedback(text: string, kind: "good" | "bad" | "" = ""): void {
  feedbackEl.textContent = text || " ";
  feedbackEl.className = `feedback${kind ? " " + kind : ""}`;
}

function sanToFromTo(fen: string, san: string): { from: string; to: string } {
  const c = new Chess(fen);
  const m = c.move(san);
  return { from: m.from, to: m.to };
}
