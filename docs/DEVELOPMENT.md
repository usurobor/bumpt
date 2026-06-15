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
idea → spec (main) → code (dev) → CI gate (dev) → promote (dev → deploy) + tag + release → vercel deploy --prod
```

Specs and decisions land on `main`. Code lands on `dev`. Every push to `dev`
runs the CI gate; only on green does the pipeline fast-forward `dev → deploy`,
tag the release, cut release notes, and **ship to Vercel via the CLI**
(`vercel deploy --prod`, using `VERCEL_TOKEN`). The deploy is a *consequence of a
green gate*, not a separate Vercel build — one chain, one source of truth.

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

## Deploy mechanism (CLI, not Git integration)

The pipeline ships to Vercel with the **Vercel CLI** from the deploy job
(`vercel deploy --prod`), *not* Vercel's Git integration. Reasons, learned the
hard way:

- The CI gate stays the single source of truth — Vercel never builds outside it.
- A Vercel token can deploy but **cannot provision Postgres**; the DB (Neon, via
  Vercel Postgres) is connected once in the dashboard. Its `DATABASE_URL` is
  injected into the project and read by the app at runtime.
- The **`deploy` branch + `deploy-<ts>` tag** remain the durable "what's live"
  record and release anchor, even though the actual ship is the CLI step.
- First-time bring-up (project create, env, schema load) is the one-off
  `vercel-setup.yml` (`workflow_dispatch`). Schema is applied through an
  OPS-token-guarded `/api/migrate` route that runs `schema.sql` via the app's
  runtime DB — the pulled `vercel env` dotenv is binary-flagged and unparseable,
  so don't try to extract `DATABASE_URL` in CI.

**`main` also carries the cnos agent hub** (`.cn-sigma/` activation channel +
`.github/` wake), which must live on the default branch for the wake to run and
for home to read the channel.

## When to harden

If/when bumpt has a real live surface (beyond the throwaway experiment), add a
branch ruleset on `deploy` (block direct pushes) and expand the gate (e.g. a
live-site post-deploy test). Until then, controlled releases come from the gated
`dev → deploy` promotion.
