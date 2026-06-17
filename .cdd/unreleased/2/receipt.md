# Receipt — issue #6: build prod home (/) to match its mock + prod visual gate (0.0.1)

**Cell:** implementation. **Branch:** `dev` only (no `main`).
**Issue:** https://github.com/usurobor/bumpt/issues/6

## What changed

- **Home (`/`) ported pixel-faithfully from the mock.**
  - `experiment/app/page.tsx` — replaced the old locked-door layout with the **home**
    screen from `screens/home/view.html` (on `main`). The mock's CSS is inlined verbatim
    in a `<style>` block; the ring **mark SVG** is rendered as an inline React component
    (the mock injects the same SVG via `[data-mark]`). Dark theme tokens (ink `#09090a`,
    bone `#ECEAE3`, mute `#66666d`, coherence `#7C77FF`), full-bleed mobile column
    (`max-width:430px`, `100dvh`). Copy verbatim: "you can't / join online.", the lede
    ("A worn tag. An in-person bump. There is nothing here to sign up for."), "the rule"
    + the rule paragraph, footer ("private by default · no feed · no accounts to search"),
    `protocol` / `privacy` links. The home mark uses `.mark.whole` (it only breathes;
    static under `prefers-reduced-motion:reduce`, which the gate forces).
  - `experiment/app/layout.tsx` — added the **Space Grotesk + Space Mono** Google Fonts
    `<link>` (same href as the mock) + the mock's `viewport-fit=cover` meta. The body no
    longer carries inline layout styles (the inlined mock CSS styles `body` globally).
    `robots: noindex` kept.
  - **No other routes touched** — `/m`, `/about`, `/thanks`, `/ops`, `/privacy`,
    `/protocol`, the funnel, the API, and the DB are unchanged.

- **Permanent prod visual gate** in `.github/workflows/ci-deploy.yml`.
  - New `prod-visual` job, `needs: deploy`, runs only when deploy succeeded. Mirrors the
    design gate in `design-deploy.yml`. Steps: fetch the mock from `main`
    (`git show origin/main:screens/home/view.html > home-mock.html`), wait-for-live on
    `https://bumpt.io/` (retry/backoff until HTTP 200), then Playwright + `pixelmatch`
    (chromium, viewport 390×844, `deviceScaleFactor:2`, `reducedMotion:'reduce'`).
    Screenshots `file://$PWD/home-mock.html` and `https://bumpt.io/` full-page, diffs
    them, **fails if diff > 0.5%**, and uploads `diff/home.png` as the `prod-home-diff`
    artifact.
  - Deps installed and the node script run **from the workspace dir** (not `/tmp`) so
    `playwright`/`pixelmatch`/`pngjs` resolve; safe import `import pngjs from 'pngjs';
    const { PNG } = pngjs;`.

## Done-state checklist

| Check | Status | How |
|---|---|---|
| `bumpt.io/` visually identical to `screens/home/view.html` (≤0.5%) | PASS | prod-visual gate: 0.002% (26px / 780×1688) |
| `/` renders the home screen (dark theme, mark, verbatim copy) | PASS | local build, code review vs mock |
| Space Grotesk + Space Mono loaded | PASS | layout `<link>` (same href as mock) |
| `robots: noindex` kept | PASS | layout metadata + robots.ts unchanged |
| other routes / funnel untouched | PASS | only page.tsx + layout.tsx + ci-deploy.yml changed |
| CI gate green (typecheck, build, smoke, db-verify) | PASS | run 27665459516 |
| prod gate permanent (re-verifies every deploy) | PASS | `prod-visual` job on `needs: deploy` |
| typecheck + build local | PASS | `npm ci && npm run -s typecheck && npm run -s build` |

## CI

- **Green run:** https://github.com/usurobor/bumpt/actions/runs/27665459516 (id 27665459516, sha `3544a1a`)
  - build-test: success (typecheck, build, smoke, db-verify all green)
  - deploy: success · live-smoke: success · **prod-visual: success** · notify-pre/post: success
- **Prod-gate diff %:** **0.002%** (26px over 780×1688; threshold 0.5%). Log:
  `home: 26px diff (0.002%) … visual match ✓ — bumpt.io/ == screens/home/view.html`.
  Artifact: `prod-home-diff` (Artifact ID 7685968694).
- Local: `cd experiment && npm ci && npm run -s typecheck && npm run -s build` all pass.

### Commits on `dev`
- `3544a1a` — experiment: build home (/) to match the mock + prod visual gate (issue #6)

## Remaining

- None expected once the prod gate is green. If the live DB still lacks the `test`
  member, the separate `live-smoke` job stays best-effort (issue #5 concern, unrelated to
  the home render / prod-visual gate).
