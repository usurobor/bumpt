# design/ — bump visual source of truth

Standalone, full-viewport HTML renders of each app screen. Open any file directly
in a browser and it looks exactly like that screen on a phone (full-bleed, no
device bezel). This is the **look-&-feel reference the experiment app is built to
match** — it is not the running app.

## Screens

| File | Screen | Route it mirrors |
|------|--------|------------------|
| [`index.html`](./index.html) | **index** — a plain list of links to the screens (site root) | — |
| [`home.html`](./home.html) | locked door | `/` |
| [`card.html`](./card.html) | scanned member card | `/m/<member>` |
| [`about.html`](./about.html) | no-signup / ask | `/about` |
| [`thanks.html`](./thanks.html) | live knock count | `/thanks` |
| [`gallery.html`](./gallery.html) | all four in device frames (each tile is the real screen via iframe) | — |

`design.bumpt.io` opens the **index** (links to every screen). `gallery.html` is
the device-framed view.

The flow is clickable: **card → about → thanks** (each "Ask to bump" coheres the
mark, then navigates).

## System

- `app.css` — design tokens + components (the one home for the styles).
- `bump.js` — injects the ring mark, runs the cohere animation, handles
  screen-to-screen navigation, ticks the counter.
- Tokens: ink `#09090A`, bone `#ECEAE3`, mute `#66666D`, **coherence `#7C77FF`**
  (the only accent, used only at the moment of a bump). Type: Space Grotesk
  (human lines) / Space Mono (structural).
- The idea: **cohering** — one ring, whole at rest, drawing itself into one when a
  bump happens.

## Source

- `reference/01_bumplookandfeel.html` — the original look-&-feel gallery.
- `reference/01_bumplookandfeel.pdf` — the same, as PDF.

Copy is kept verbatim from the reference and aligned with the live product
(*ask to bump → a knock, not membership*; BUMP-050 / BUMP-101 v0.1.3).
