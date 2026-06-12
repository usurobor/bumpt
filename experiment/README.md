# Bump — Stone Techno experiment (throwaway)

This app runs the field experiment specified in [`../docs/BUMP-101.md`](../docs/BUMP-101.md).
It is disposable: the only durable parts are the constitution (BUMP-000 §5) and the card shape.
It is **not run or deployed yet** — it needs a Supabase project, env, and real-phone QA (the
QA step in BUMP-101's sequence) before the prereg tag is cut.

## What it does

A scan of a worn QR opens a teaser card; "What is this?" leads to an About page that explains
Bump is in-person only and invites a **bump request** (a waitlist email — never membership,
BUMP-000 §5.1). It measures, per member, anonymously: scans (by exposure context), About-opens,
bump requests, and the funnel between them.

The tag-wearer is a `member` (a node). In this experiment the members are the three founders.

## Routes

| Route | Purpose |
|---|---|
| `GET /m/:member` | the worn-tag target — renders the card, records a scan tagged with the member's active exposure context, threads `scan_id` into About |
| `GET /about?f=:member&s=:scan_id` | the explainer + bump-request form |
| `POST /api/bump-request` | stores a deduped, consented email |
| `GET /ops/:member?token=` | per-member ops: open/close exposure windows, live counts |
| `POST /api/ops/window` | start/stop an exposure window |
| `GET /ops/export?token=` | per-member-context CSV export |

## Tables

`members`, `exposure_sessions`, `scan_events`, `about_events`, `bump_requests`, `consent_versions`
(see [`schema.sql`](./schema.sql)). No IP, user agent, ad pixels, or behavioral analytics are stored.

## Setup

1. Create a Supabase project; run `schema.sql` (seeds 3 members `a/b/c` + consent `v1`).
2. Edit the seeded members (real bump names, `pic_url`).
3. Copy `.env.example` → `.env`; set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPS_TOKEN`.
4. `npm install && npm run dev` (or deploy to Vercel with the same env).
5. Generate one QR per member pointing at `https://<host>/m/<id>`; print on the tees with a text cue (e.g. "Bump me?").
6. Run the [QA runbook](./QA-RUNBOOK.md) on real phones, then freeze the prereg tag.

## Acceptance (BUMP-101 §10)

Distinct URL per member · founder test scans excludable (set a `test` window) · no fingerprinting
or ad pixels · consent version stored with each email · emails deduped (unique constraint) ·
per-member funnel viewable (`/ops/:member`) · aggregate CSV export (`/ops/export`).

## Honest status

Written, not run. No Supabase creds or deploy in this environment, so it is unverified end-to-end;
real-phone QA is the next step before the prereg tag.
