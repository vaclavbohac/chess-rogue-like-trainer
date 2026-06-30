import type { RunView } from "../engine/run";
import { VENUES } from "../engine/venues";

/**
 * The between-Tier Interstitial: a display-only pause shown at a Tier boundary
 * mid-run (engine signal `justCrossedTier`). Within a Tier, encounter-to-encounter
 * is seamless, so this only ever appears when crossing venues. It shows the tier
 * path (cleared venues, the one you're about to enter, and what's still ahead),
 * hearts remaining, points earned so far this run, and a heal note when the Tier
 * Heal upgrade just restored a heart. The Continue button is wired by the caller.
 *
 * `view.tier` here is the venue just entered (the "next" stop on the path).
 */
export function interstitialHtml(view: RunView): string {
  const path = VENUES.map((v) => {
    const cleared = v.tier < view.tier;
    const current = v.tier === view.tier;
    const cls = cleared ? "done" : current ? "next" : "ahead";
    const mark = cleared ? " ✓" : current ? " (next)" : "";
    return `<li class="leg ${cls}">${v.name}${mark}</li>`;
  }).join("");

  const hearts =
    "♥".repeat(view.hearts) + "♡".repeat(Math.max(0, view.maxHearts - view.hearts));

  const heal = view.tierHealApplied
    ? `<p class="heal-note">Tier Heal: +1 heart for clearing the venue.</p>`
    : "";

  return `
    <h2>Venue cleared</h2>
    <p class="inter-sub">Next up: <strong>${view.venue}</strong></p>
    <ol class="tier-path">${path}</ol>
    <div class="inter-stats">
      <span class="hearts">${hearts}</span>
      <span class="pill">${view.points} pts this run</span>
    </div>
    ${heal}
    <div class="overlay-actions">
      <button id="inter-continue" class="btn">Continue</button>
    </div>
  `;
}
