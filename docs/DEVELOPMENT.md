# Development model

bumpt uses the **cnos three-branch, spec-driven model** — the standard practice
for cnos projects of this type (a Vercel/Next-style app paired with a spec hub
and a cnos agent activation channel). bumpt is the reference implementation.

## Branches

| Branch | Holds | Role |
|--------|-------|------|
| **`main`** (default) | `docs/` (specs), `README.md`, `CLAUDE.md`, `.cn-sigma/` channel, `.github/` wake | specs + cnos agent hub |
| **`dev`** | `experiment/` app code, `.github/workflows/` CI | code |
| **`deploy`** | `experiment/` (promoted from `dev`) | what Vercel builds (Root Directory `experiment/`) |

`main` = what we want · `dev` = what we built · `deploy` = what's live.

The branches are **disjoint by file** (no `experiment/` on `main`; no `docs/` on
`dev`), so they never merge-conflict.

## Flow

```
idea → spec (main) → code (dev) → CI gate (dev) → promote (dev → deploy) → Vercel deploys
```

Specs and decisions land on `main`. Code lands on `dev`. Every push to `dev`
runs the CI gate; only on green does the pipeline fast-forward `dev → deploy`,
tag the release, and cut release notes. Vercel's Git integration then builds
`deploy:experiment/` and ships.

## CI gate (on `dev`)

The gate (`.github/workflows/ci-deploy.yml` on `dev`) runs on every push to `dev`:

1. `tsc --noEmit` typecheck
2. `next build`
3. **Smoke test** of the funnel against a throwaway Postgres reached through a
   local Neon HTTP proxy (the app uses the `@neondatabase/serverless` HTTP driver,
   which can't talk to plain Postgres directly).
4. **Data-state verify** via `psql` — asserts DB rows directly, immune to any
   app/proxy render caching.

Only a green gate promotes `dev → deploy`. Status is reported to Telegram
(green-short / red-detailed) by the same workflow — see
[`CI-TELEGRAM.md`](./CI-TELEGRAM.md).

## Notes specific to bumpt

- **Vercel builds from source**, so `deploy` carries *source*, not a pre-built
  artifact. Vercel's Git integration is the release mechanism — no separate
  release workflow or deploy key needed.
- **`main` also carries the cnos agent hub** (`.cn-sigma/` activation channel +
  `.github/` wake), which must live on the default branch for the wake to run and
  for home to read the channel.

## When to harden

If/when bumpt has a real live surface (beyond the throwaway experiment), add a
branch ruleset on `deploy` (block direct pushes) and expand the gate (e.g. a
live-site post-deploy test). Until then, controlled releases come from the gated
`dev → deploy` promotion.
