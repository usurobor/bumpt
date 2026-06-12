# Bump — Stone Techno experiment (throwaway)

This app runs the field experiment specified in [`../docs/BUMP-101.md`](../docs/BUMP-101.md).
It is disposable: the only durable parts are the constitution (BUMP-000 §5) and the card shape.
It is **not run or deployed yet** — it needs a Supabase project, env, and real-phone QA before
the prereg tag is cut.

## What it does

A scan of a worn QR opens a teaser card; "What is this?" leads to an About page that explains
Bump is in-person only and offers a **one-tap "I want in"** — no email, no signup, no PII
(BUMP-000 §5.1). After the tap: "come back in a month" + a live count of how many want in. It
measures, per member, anonymously: scans (by exposure context), About-opens, and want-ins.

The tag-wearer is a `member` (a node). In this experiment the members are the three founders.

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

1. Create a Supabase project; run `schema.sql` (seeds 3 members `a/b/c`).
2. Edit the seeded members (real bump names, `pic_url`).
3. Copy `.env.example` → `.env`; set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPS_TOKEN`.
4. `npm install && npm run dev` (or deploy to Vercel with the same env).
5. Generate one QR per member pointing at `https://<host>/m/<id>`; print with a text cue ("Bump me?").
6. Run the [QA runbook](./QA-RUNBOOK.md) on real phones, then freeze the prereg tag.

## Deployment acceptance

After Supabase + Vercel wiring, verify on the live URL:

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
- [ ] the service role key is never client-exposed (server-only env)

Vercel: set the project **Root Directory** to `experiment/`; add `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `OPS_TOKEN` as environment variables.

## Honest status

Builds and typechecks; not run against a real Supabase or on real phones yet. Real-phone QA
is the next step before the prereg tag.
