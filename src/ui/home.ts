import {
  BASE_HEARTS,
  MAX_HEART_LEVELS,
  buyUpgrade,
  saveProgress,
  upgradeById,
  type KeyValueStore,
  type Progress,
} from "../engine/persistence";
import { VENUES, venueName } from "../engine/venues";

export interface HomeCallbacks {
  /** Begin a new Run with the player's current effective upgrades. */
  onStartRun: () => void;
}

/**
 * The Home screen (Hades' between-runs hub): title, points wallet, furthest-reach
 * high-water mark, a big Start Run button, and the Shop ("the Mirror") on the same
 * page. Framework-free DOM, re-rendered in place after each purchase so the wallet
 * and shop state stay in sync. Only the +1 Max Heart upgrade is stocked for now.
 */
export function renderHome(
  root: HTMLElement,
  progress: Progress,
  store: KeyValueStore,
  cb: HomeCallbacks,
): void {
  const fr = progress.furthestReach;
  const reach = fr.cleared
    ? `Best: reached the final <span class="badge">Cleared</span>`
    : `Best: reached ${venueName(fr.tier)}`;

  root.innerHTML = `
    <div class="shell home">
      <header><h1>Caro-Kann Trainer</h1></header>
      <div class="wallet"><span class="coin">◆</span> ${progress.points} points</div>
      <p class="reach">${reach}</p>
      <button id="start-run" class="btn btn-lg">Start Run</button>
      <section class="venues">
        <h2>The Gauntlet</h2>
        <div class="venue-preview">${venuePreviewHtml(fr.tier, fr.cleared)}</div>
        <p class="note">Every run runs all four venues, easiest first.</p>
      </section>
      <section class="shop">
        <h2>Shop</h2>
        <div id="shop-list"></div>
      </section>
      <p class="note">Spend banked points on permanent upgrades, then run the gauntlet.</p>
    </div>
  `;

  root.querySelector<HTMLButtonElement>("#start-run")!.addEventListener("click", cb.onStartRun);
  renderShop(root, progress, store, cb);
}

/**
 * Preview the four venues (each in its own theme palette via the `themeClass`),
 * marking how far the player has reached. A CSS-only mini board square sits in each
 * card so the palettes read at a glance — no run is needed to see the venues.
 */
function venuePreviewHtml(reachedTier: number, cleared: boolean): string {
  return VENUES.map((v) => {
    const reached = v.tier <= reachedTier;
    const mark = cleared && v.tier === VENUES[VENUES.length - 1]!.tier ? " ✓" : "";
    return `
      <div class="venue-card ${v.themeClass} ${reached ? "reached" : ""}">
        <div class="venue-board" aria-hidden="true"></div>
        <div class="venue-name">${v.name}${mark}</div>
      </div>
    `;
  }).join("");
}

/** Render the Shop's stock (currently only +1 Max Heart) and wire its Buy button. */
function renderShop(
  root: HTMLElement,
  progress: Progress,
  store: KeyValueStore,
  cb: HomeCallbacks,
): void {
  const list = root.querySelector<HTMLDivElement>("#shop-list")!;
  const entry = upgradeById("maxHeart");
  const owned = progress.ownedUpgrades;
  const cost = entry.cost(owned);
  const maxed = !entry.available(owned);
  const affordable = cost != null && progress.points >= cost;

  const status = maxed
    ? `<span class="badge">Maxed</span>`
    : `Lv ${owned.maxHeartLevel}/${MAX_HEART_LEVELS}`;
  const btnLabel = maxed ? "Maxed" : `Buy · ${cost}`;
  const disabled = maxed || !affordable;

  list.innerHTML = `
    <div class="shop-item">
      <div class="shop-meta">
        <div class="shop-name">${entry.name} <span class="shop-level">${status}</span></div>
        <div class="shop-desc">${entry.description}</div>
        <div class="shop-sub">Max hearts now: ${BASE_HEARTS + owned.maxHeartLevel}</div>
      </div>
      <button id="buy-maxHeart" class="btn btn-secondary" ${disabled ? "disabled" : ""}>${btnLabel}</button>
    </div>
  `;

  const buyBtn = list.querySelector<HTMLButtonElement>("#buy-maxHeart")!;
  buyBtn.addEventListener("click", () => {
    if (buyUpgrade(progress, "maxHeart")) {
      saveProgress(store, progress);
      // Re-render the whole Home so the wallet and shop state update together.
      renderHome(root, progress, store, cb);
    }
  });
}
