# Receipt — issue #5: harden BUMP-101 experiment instrumentation (0.0.1)

**Cell:** implementation. **Branch:** `dev` only (no `main`, no BUMP-001, no Accept/AdmissionReceipt).
**Issue:** https://github.com/usurobor/bumpt/issues/5

## What changed

- **Scan-originated asks (#1).**
  - `experiment/app/about/page.tsx` — the Ask-to-bump button is rendered as a working
    form only when `s` matches a real `scan_events` row whose `member_id` is `m`.
    Opened directly (or with a forged/missing `m`/`s`) the page explains the rule and
    renders a **disabled** button plus "Scan a member first — you can only ask to bump
    from a member card."
  - `experiment/app/api/bump-request/route.ts` (replaces `app/api/want-in/route.ts`)
    — POST is rejected (303 → `/about`, records nothing) unless `m`+`s` are present and
    `s` matches a real scan for member `m`. A real scanned flow records exactly one row.
- **Unique-people vs per-member (#2).** New table `bump_request_events(id, device_id,
  member_id, scan_id, created_at, unique(device_id, member_id))` replaces `want_ins`'s
  `device_id UNIQUE`. Insert uses `on conflict (device_id, member_id) do nothing`.
  - global unique people = `count(distinct device_id)` (`/thanks`, excludes `test` member)
  - per-member = `count(*) by member_id` (`/ops/[member]`, export)
- **Privacy / copy (#3).** `experiment/app/privacy/page.tsx`: "no personal data" → "no
  contact data"; "I want in" → "Ask to bump"; "want-ins" → "bump requests"; dedupe id
  described as one random first-party online identifier, not derived from device
  characteristics, deletable with the experiment data; DB stores no IP/UA/pixels/analytics.
  Cookie `bw_id` lifetime reduced from 365d to **75 days** (60–90d window).
- **Product vocabulary (#4).** `/api/want-in` → `/api/bump-request`; `want_ins` →
  `bump_request_events`; `want_in_count` → `bump_request_count` (CSV header
  `bump_requests` + `*_bump_request_rate`). Updated callers: `test/smoke.mjs`, the CI
  "Verify database state" psql step, `schema.sql`, `/thanks`, `/ops/[member]`, the export,
  README.md, QA-RUNBOOK.md. **No `want[-_]in` tokens remain in `experiment/`** (grep clean).
- **DB constraints (#5).** `schema.sql` (and therefore the `/api/migrate` path) adds
  `exposure_context_check` and `scan_context_check`
  (`unprompted|after_conversation|member_directed|test|unknown`) via
  drop-if-exists + add (idempotent through the migrate route), and
  `create unique index if not exists scan_events_scan_id_unique on scan_events(scan_id)`.
  Also seeds a dedicated `test` member.
- **Live post-deploy smoke (#6).** New `live-smoke` job in `.github/workflows/ci-deploy.yml`
  runs after a successful deploy. It is **read-only** and scoped to the dedicated `test`
  member (excluded from demand metrics): it GETs `/`, `/privacy`, `/m/test`,
  `/about?m=test&s=<scan>` and bare `/about`, asserting the scan-origination rule renders.
  It **never POSTs** `/api/bump-request`, so it cannot increment any public count.

## Done-state checklist

| Check | Status | How |
|---|---|---|
| `/m/a` → `/about?m=a&s=<scan>` → Ask to bump → `/thanks` | PASS | smoke flow + db-verify |
| direct `/about` explains rule but cannot ask | PASS | smoke asserts disabled + no form |
| forged POST without real `m`+`s` fails (records nothing) | PASS | smoke asserts 303→/about; db-verify counts |
| same device + same member dedupes | PASS | db-verify `mem_a = 1` after 2 taps |
| same device + different member preserves per-member count | PASS | db-verify `mem_b = 1` |
| global unique = distinct device | PASS | db-verify `distinct device_id = 1` |
| privacy says contact-data-free (not "no personal data") | PASS | privacy page copy |
| cookie lifetime 60–90 days | PASS | `bw_id` maxAge = 75d |
| no `want-in` tokens remain in `experiment/` | PASS | `grep -i 'want[-_]in' experiment/` → no matches |
| export computes §7 bars directly | PASS | per-member-context CSV with rates |
| live post-deploy smoke does not pollute public metrics | PASS | read-only, test member, no POST |
| CI gate green (typecheck, build, smoke, db-verify) | SEE BELOW | CI run |

## CI

- Run: <RUN_URL> (id <RUN_ID>) — <RESULT>
- Local: `cd experiment && npm ci && npm run -s typecheck && npm run -s build` all pass.

## Remaining: apply schema/constraints to the LIVE DB (post-deploy runner action)

The sandbox cannot reach the live Neon DB. The new table, constraints, unique index, and
`test` member must be applied to production via the guarded migrate route after deploy.
From a host with network egress, POST the schema to the live site:

```sh
curl -sS -X POST "https://bumpt.io/api/migrate?token=$OPS_TOKEN" \
  --data-binary @experiment/schema.sql
```

Notes:
- The route is idempotent (`create table/index if not exists`, `on conflict`,
  `drop constraint if exists` before `add constraint`).
- It runs one statement per `sql()` call (Neon HTTP driver), splitting `schema.sql` on `;`
  after stripping `--` comments — keep that intact.
- If a legacy `want_ins` table holds only pre-prereg QA data, it is now unused; drop it
  manually if desired (`drop table if exists want_ins;`). All pre-prereg live data is QA
  data and must be purged or marked excluded before the `bump-101-prereg` freeze (per the
  issue). Not done here — that is the operator's pre-freeze step.
