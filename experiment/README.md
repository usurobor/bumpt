# Bump — Stone Techno experiment (throwaway)

This app runs the field experiment specified in [`../docs/BUMP-101.md`](https://github.com/usurobor/bumpt/blob/main/docs/BUMP-101.md).
It is disposable: the only durable parts are the constitution (BUMP-000 §5) and the card shape.
It is **not deployed yet** — it needs a database, env, and real-phone QA before the prereg tag.

## What it does

A scan of a worn QR opens a teaser card; "What is this?" leads to an About page that explains
Bump is in-person only and offers a **one-tap "I want in"** — no email, no signup, no PII
(BUMP-000 §5.1). After the tap: "come back in a month" + a live count of how many want in. It
measures, per member, anonymously: scans (by exposure context), About-opens, and want-ins.

The tag-wearer is a `member` (a node). In this experiment the members are the three founders.

## Stack

- **Vercel** — hosts the Next.js app.
- **Vercel Postgres (Neon)** — the database; the integration injects `DATABASE_URL` into the
  project automatically. The app talks to it with `@neondatabase/serverless` (plain SQL).
- No NFC, auth, Spotify, or third-party analytics.

## Routes

| Route | Purpose |
|---|---|
| `GET /m/:member` | the worn-tag target — renders the card, records a scan tagged with the member's active exposure context, threads `scan_id` into About |
| `GET /about?m=:member&s=:scan_id` | the explainer + one-tap "I want in" |
| `POST /api/want-in` | records a want-in, deduped by an anonymous first-party cookie id (no PII) |
| `GET /thanks` | "come back in a month" + live want-in count |
| `GET /ops/:member?token=` | per-member ops: open/close exposure windows, live counts |
| `POST /api/ops/window` | start/stop an exposure window |
| `GET /ops/export?token=` | per-member-context CSV export |

## Tables

`members`, `exposure_sessions`, `scan_events`, `about_events`, `want_ins` (see
[`schema.sql`](./schema.sql)). No email, IP, user agent, ad pixels, or behavioral analytics —
the only thing stored per person is an anonymous random `device_id` used to dedupe taps.

## Setup

1. Deploy the app to Vercel (root directory `experiment/`).
2. Add **Postgres (Neon)** storage to the Vercel project → `DATABASE_URL` is injected automatically.
3. Run [`schema.sql`](./schema.sql) once in the Neon query console (creates tables, seeds 3 members).
4. Set `OPS_TOKEN` in the project's env vars.
5. Edit the seeded members (real bump names, `pic_url`).
6. Generate one QR per member pointing at `https://<host>/m/<id>`; print with a text cue ("Bump me?").
7. Run the [QA runbook](./QA-RUNBOOK.md) on real phones, then freeze the prereg tag.

Local dev: paste a Neon/Postgres connection string into `.env` as `DATABASE_URL`, set `OPS_TOKEN`, `npm install && npm run dev`.

## Deployment acceptance

After wiring, verify on the live URL:

- [ ] `/m/a` records a scan_event
- [ ] `/m/a` → About carries `m` and `s`
- [ ] opening About records an about_event
- [ ] tapping "I want in" records a want_in and lands on `/thanks`
- [ ] `/thanks` shows "come back in a month" + the want-in count
- [ ] tapping again from the same device does not create a second want_in (anonymous dedupe)
- [ ] opening an ops window changes the context of subsequent scans
- [ ] "Stop window" returns new scans to `unknown`
- [ ] `/ops/export` CSV computes the §7 bars directly (per-member-context, with rates)
- [ ] no email / IP / user agent / pixel is stored
- [ ] `DATABASE_URL` and `OPS_TOKEN` are server-only (never client-exposed)

## Honest status

Builds and typechecks; not run against a real database or on real phones yet. Real-phone QA
is the next step before the prereg tag.
