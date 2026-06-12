# BUMP-101: Stone Techno Field Experiment

> A pre-MVP worn-QR smoke test: does a visible tag in a real scene earn scans and bump requests before we build the mechanism?

- **Status:** Draft v0.1.1 · Field Experiment Brief (pre-registered)
- **Derives from:** [BUMP-000](./BUMP-000.md) (constitution) · de-risks [BUMP-100](./BUMP-100.md) (the MVP)
- **Governing question:** What does the Stone Techno experiment test, how is it measured, and what does the result decide?

This document is a pre-registered field experiment, not a product spec. The build is throwaway; only the result matters. Outcomes are recorded separately in [`BUMP-101-RESULTS.md`](./BUMP-101-RESULTS.md) — this file is not edited after the event.

Changelog:
- v0.1.1 — reviewer pass: role → Field Experiment Brief; "signup" → "bump request" (constitutional vocabulary); pre-committed decision bars; "unprompted" defined + scan-context exclusion; physical QR spec; consent/retention (GDPR); build acceptance checklist; results-artifact split.
- v0.1.0 — initial brief.

## 1. Hypothesis

Two claims, both falsifiable in one weekend:

- **H1 — the hook.** A worn QR code in a real scene gets scanned **unprompted**.
- **H2 — the demand.** A meaningful share of scanners ask to get bumped in.

A scan counts as **unprompted** only if the founder did not ask, point, explain, or gesture for the person to scan before the scan happened. Only unprompted scans count toward H1 (see §6 scan context).

The experiment tests the front door — attention and demand. It does not test the thesis. **The experiment proves the hook; the MVP proves the mechanism.**

## 2. Scope

Tests: worn QR → scan → card → "what is this?" → bump request.

Does **not** test (deferred to BUMP-100): the bump, membership, live signals, Radio, scanner scoping, receipts. There is one scanner class only — the anonymous non-member — because the only members are the three founders.

An email is interest, not proof of the thesis. The MVP still has to prove physical admission, sponsor accountability, live signals, tag binding, revocation, recovery, and receipts.

## 3. Setup

- Three founders wear t-shirts carrying a Bump QR (see §8 physical requirements).
- Venue: Stone Techno festival — Zollverein, Essen, Germany, 10–12 July 2026.
- Each QR resolves to a distinct per-founder URL.
- A scan opens one static card — no app, no login.
- No NFC, no bump, no Radio, no signal editing.

## 4. The two pages

**Card** — the node card in teaser form: pic, bump name, one static line ("Bump · here at Stone Techno"), and a "What is this?" link. It is shaped like the real MVP card so the experiment previews it.

**About** — explains that Bump is a new in-person network, currently WIP, and invites a bump request.

- **CTA:** *Tell me where to get bumped*
- **Consent line:** *Leaving your email does not make you a member. Membership only happens in person, through a bump.*

## 5. Constitutional guardrail

A bump request is a **waitlist request, never membership**. Membership begins only in person (BUMP-000 §5.1). The About page says so plainly:

> Bump is in-person only. You can't sign up online — you get bumped in. Leave your email and we'll tell you where to find a bump.

This keeps the experiment from training remote-signup expectations, and it dramatizes the core rule instead of hiding it. The word "signup" appears nowhere in the product surface or the metrics.

## 6. Metrics

The tag-wearer is a **member** (a node, per BUMP-000 §7). In this experiment the members are the three founders — so the entity is generalized as `member`, and "founder" appears only where the concern is founder charisma (§7 distribution).

Per member, anonymous. Named metrics:

- `exposure_hours` — logged time a member wore the tag in-scene, by context. **The scan denominator**: 60 scans over 3 member-hours and over 40 member-hours are different results.
- `scan_count` — scans (which QR, when); normalized as `scans_per_exposure_hour`
- `about_open_count` — "What is this?" opens
- `bump_request_count` — emails left
- `scan_to_about_rate`, `about_to_request_rate`, `scan_to_request_rate`

The funnel is threaded per member — scans → About-opens → bump requests, with conversion — so "how many, of whom" is answerable. Member distribution is itself a metric: it prevents one member's (founder's) charisma from carrying the result.

**Scan context** — each member sets their current context in their ops page (§10), and every public scan inherits the active window, turning "unprompted" into a measured field condition: `unprompted` · `after conversation` · `member-directed` · `test` · `unknown`. Only `unprompted` counts toward the hook; `test` and `member-directed` are excluded from demand metrics.

Store only consented emails. Do not fingerprint scanners.

## 7. Decision rule

The experiment is decided against these bars, **frozen before the event** so the result is read, not rationalized — in a prereg tag cut after the build, copy, and QR artwork are final (§10, §12).

| Metric | Bar | Why it matters |
|---|---:|---|
| Logged exposure | ≥24 member-hours total; ≥6h per member; across ≥2 festival days | the scan denominator is real |
| Unprompted scans | ≥60 total **and** ≥2.0 per logged member-hour | the worn tag pulls attention |
| About-open rate | ≥35% of unprompted scans | the card creates curiosity |
| Bump requests | ≥12 unique non-member emails | curiosity turns into demand |
| About-to-request rate | ≥25% | the offer is clear enough |
| Member distribution | ≥2 members each ≥15 unprompted scans and ≥3 bump requests; no member supplies >70% of requests | no single member (founder) carries the result |
| Data quality | ≥85% of scans have known context; test and member-directed scans excluded; instrumentation up for ≥95% of logged exposure | the result can be trusted |

These bars are intentionally modest. The experiment should not need hundreds of emails to justify the MVP — only enough evidence that the pull is not founder charisma, friend traffic, or one lucky interaction.

| Result | Decision |
|---|---|
| Hook clears **and** demand clears | Proceed to BUMP-100 |
| Hook clears, demand misses | Fix About / CTA / positioning before building |
| Hook misses | Fix physical tag / placement / social hook before building |
| Data quality fails | Re-run; do not decide |

## 8. Physical QR requirements

Without this, "scans ≈ zero" might mean bad placement, not a bad hook.

- High contrast; large enough to scan at conversational distance.
- Placed on front chest or upper back, not folded fabric.
- Tested on iOS and Android, in low light, while the shirt is worn.
- URL short enough that the QR stays visually simple.
- One visible text cue near the QR — e.g. *Bump me?* or *What am I here for?*

## 9. Privacy, consent & retention

Stone Techno is in Essen, Germany, and the experiment collects emails, so GDPR applies. Store only consented emails; no fingerprinting, ad pixels, or behavioral analytics.

- **Form copy:** *We'll only use your email to tell you where to find a future Bump. Leaving your email does not make you a member. You can ask us to delete it any time.*
- **Retention:** delete emails after 90 days unless the person explicitly opts into continued updates.
- Record the consent text/version stored with each email.

## 10. Build

Throwaway implementation on the chosen stack: **Vercel** (per-founder card pages + About + form) and **Supabase** (emails + scan counts). No NFC, auth, or Spotify. The implementation is disposable; the constitution (§5) and the card shape are the parts worth preserving.

The build is acceptable only if:

- each founder has a distinct URL;
- founder test scans can be excluded;
- pages load fast on festival mobile networks;
- no fingerprinting, ad pixels, or behavioral analytics are used;
- email submission stores the explicit consent text/version;
- duplicate email submissions are deduped for demand metrics;
- raw aggregate counts export after the event;
- per-founder funnel counts are viewable.

## 11. Threats to validity

- One festival, one crowd. A techno scene is friendly to this format; it may not generalize.
- Founder novelty. Scans may reflect "three people testing a thing," not durable pull.
- Curiosity is not membership. An email is interest, not a willingness to get bumped in person.

## 12. What the result feeds

- The About-page copy seeds **BUMP-001** (PR/FAQ).
- The go / fix / stop outcome gates the **BUMP-100** MVP build.
- The outcome, data, and decision are recorded in **[`BUMP-101-RESULTS.md`](./BUMP-101-RESULTS.md)** — the experiment stays evidence, not narrative. This file is the pre-registration; do not edit it after the event to fit the result.
