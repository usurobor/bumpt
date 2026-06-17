# Self-building screens

The loop that lets anyone change a screen and have prod follow — verified by
screenshots, no engineer in the path.

```
edit screens/<s>/{view.html, spec.md}   (main — anyone)
        │
        ▼  design build action
design.bumpt.io rebuilds  ──►  design gate: deployed design == view.html  ✅
        │
        │  human accepts  (apply status:todo to the screen's contract issue)
        ▼  cell (ship)
build the real screen in the app  →  dev → gate → deploy → bumpt.io
        │
        ▼  prod gate
prod render == view.html  (screenshots)  ✅  →  done
```

**Match = diff ≤ 1%**, reported as a whole percent (a true match reads `0%`). Sub-percent
noise is just anti-aliasing — not worth reporting at decimal precision.

Two visual gates, same method (Playwright + pixelmatch, 390×844 @2x, reduced-motion):

- **design gate** (`design-deploy.yml`): `design.bumpt.io/<s>/` vs `screens/<s>/view.html`.
- **prod gate** (in the app's deploy pipeline): `bumpt.io/<route>` vs `screens/<s>/view.html`
  (the mock lives on `main`; the gate reads it via `git show origin/main:screens/<s>/view.html`).

## Test fixtures (why prod can pixel-match a static mock)

Prod screens are dynamic, so they only match a static mock if their data is fixed.
The rule: **prod renders a deterministic fixture whose content equals the mock.**

- A permanent, **immutable `test` member** (seeded; never edited) is the fixture for
  member-scoped screens — the gate hits `bumpt.io/m/test`, and the card mock depicts
  exactly that member's values.
- Global screens use a deterministic preview (e.g. a frozen count for `/thanks`).
- Static screens (`/` home) need no fixture.

The mock is the source of truth; the fixture is configured to match it.

## Roles

- **Σ (main):** author `view.html` + `spec.md` + the per-screen contract issue.
- **Human:** accept a screen (apply `status:todo`).
- **Cell (dev):** build the real screen + wire its prod gate; close with a receipt.
- **CI:** both gates prove design == mock and prod == mock.
