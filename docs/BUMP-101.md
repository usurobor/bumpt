# BUMP-101: Stone Techno POC

> A worn-QR smoke test: does a tag in a real scene pull scans and demand — before we build any mechanics?

- **Status:** Draft v0.1.0
- **Derives from:** [BUMP-000](./BUMP-000.md) (constitution) · de-risks [BUMP-100](./BUMP-100.md) (the MVP)
- **Governing question:** What does the Stone Techno POC test, how is it measured, and what does the result decide?

This document explains the Stone Techno POC. It is a field experiment, not a spec — the build is throwaway; only the result matters.

## 1. Hypothesis

Two claims, both falsifiable in one weekend:

- **H1 — the hook.** A worn QR code in a real scene gets scanned, unprompted.
- **H2 — the demand.** A meaningful share of scanners want into Bump.

The POC tests the front door — attention and demand. It does not test the thesis.

## 2. Scope

Tests: worn QR → scan → card → "what is this?" → interest.

Does **not** test (deferred to BUMP-100): the bump, membership, live signals, Radio, scanner scoping, receipts. There is one scanner class only — the anonymous non-member — because the only members are the three founders.

The boundary is deliberate: the POC proves the *hook*, the MVP proves the *mechanism*.

## 3. Setup

- Three founders wear t-shirts carrying a Bump QR.
- Venue: Stone Techno festival.
- Each QR resolves to a distinct per-founder URL.
- A scan opens one static card — no app, no login.
- No NFC, no bump, no Radio, no signal editing.

## 4. The two pages

**Card** — the node card in teaser form: pic, bump name, one static line ("Bump · here at Stone Techno"), and a "What is this?" link. It is shaped like the real MVP card so the POC previews it.

**About** — explains that Bump is a new in-person network, currently WIP, and invites an email.

## 5. Constitutional guardrail

Signup is a **waitlist, never membership**. Membership begins only in person (BUMP-000 §5.1). The About page says so plainly:

> Bump is in-person only. You can't sign up online — you get bumped in. Leave your email and we'll tell you where to find a bump.

This keeps the POC from training remote-signup expectations, and it dramatizes the core rule instead of hiding it.

## 6. Metrics

Per founder, anonymous:

- scans (which QR, when)
- About-opens
- signups (emails)

The funnel is threaded per founder — scans → About-opens → signups, with conversion — so "how many, of whom" is answerable. Store only consented emails; do not fingerprint scanners.

## 7. Decision rule

Set the numeric bars **before** the festival, so the result is read, not rationalized.

| Result | Decision |
|---|---|
| Scans happen **and** signup conversion clears the bar | Proceed to the BUMP-100 MVP build |
| Scans happen, signups ≈ zero | Hook works, offer doesn't — fix the pitch/About before building |
| Scans ≈ zero | A worn QR doesn't pull in this scene — rethink the tag/hook |

Founders fix the bars (total signups N, conversion X%) ahead of the event.

## 8. What the result feeds

- The About-page copy seeds **BUMP-001** (PR/FAQ).
- The go / fix / stop outcome gates the **BUMP-100** MVP build.

## 9. Threats to validity

- One festival, one crowd. A techno scene is friendly to this format; it may not generalize.
- Founder novelty. Scans may reflect "three people testing a thing," not durable pull.
- Curiosity is not membership. An email is interest, not a willingness to get bumped in person.

## 10. Build

Throwaway implementation on the chosen stack: **Vercel** (per-founder card pages + About + form) and **Supabase** (emails + scan counts). No NFC, auth, or Spotify. A day or two of work. The implementation is disposable; the constitution (§5) and the card shape are the parts worth preserving.
