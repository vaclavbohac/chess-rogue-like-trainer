import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages project site is served from /<repo>/, so assets must resolve there.
const base = "/chess-rogue-like-trainer/";

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      // Precache everything so the app works fully offline (e.g. on a flight).
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
      manifest: {
        name: "Caro-Kann Roguelike Trainer",
        short_name: "Caro-Kann",
        description:
          "A roguelike trainer for drilling the Caro-Kann Defense (Black).",
        theme_color: "#312e2b",
        background_color: "#312e2b",
        display: "standalone",
        start_url: base,
        scope: base,
        icons: [
          // TODO(M1): real raster icons for iOS/Android install.
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
