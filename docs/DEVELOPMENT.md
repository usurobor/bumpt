# Development model

bumpt uses a three-branch, spec-driven model, adapted from the `bb-shop` house model.

## Branches

| Branch | Holds | Role |
|--------|-------|------|
| **`main`** (default) | `docs/` (BUMP-000/100/101…), `README.md`, `CLAUDE.md`, `.cn-sigma/` channel, `.github/` wake | specs + cnos agent hub |
| **`dev`** | `experiment/` app code | code |
| **`deploy`** | `experiment/` (promoted from `dev`) | what Vercel builds (Root Directory `experiment/`) |

`main` = what we want · `dev` = what we built · `deploy` = what's live.

The branches are **disjoint by file** (no `experiment/` on `main`; no `docs/` on `dev`), so they never merge-conflict.

## Flow

```
idea → spec (main) → code (dev) → build-verify → promote (dev → deploy) → Vercel deploys
```

Specs and decisions land on `main`. Code lands on `dev`. To release, fast-forward/merge `dev → deploy`; Vercel's Git integration builds `deploy:experiment/` and ships.

## Deltas from bb-shop (why this isn't a copy)

- **Vercel builds from source**, so bumpt's `deploy` carries *source*, not a pre-built artifact. bb-shop's `deploy` is a built Shopify theme pushed by a release workflow via an SSH deploy key. bumpt needs neither for the throwaway experiment — Vercel's Git integration is the release mechanism.
- **`main` also carries the cnos agent hub** (`.cn-sigma/` activation channel + `.github/claude-wake.yml`), which must live on the default branch for the wake to run and for home to read the channel.
- **No CI test gate yet.** bb-shop runs a pre-deploy Playwright matrix on `dev`. Here the POC relies on local build-verify + real-phone QA. Add a gate on `dev` when the surface warrants it.

## When to harden

If/when bumpt has a real live surface (beyond the throwaway experiment), adopt bb-shop's deploy-protection story: a branch ruleset on `deploy` (block all direct pushes) + a deploy-key-only release workflow + a pre-deploy CI gate. Until then, controlled releases come from promoting `dev → deploy` deliberately.
