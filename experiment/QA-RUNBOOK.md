# QA runbook — BUMP-101 Stone Techno experiment

Run this before freezing the prereg tag. A failed scan must mean "bad hook," not "bad QR."

## Physical QR (BUMP-101 §8)

- [ ] High contrast; large enough to scan at conversational distance.
- [ ] On front chest or upper back; not on folded/creased fabric.
- [ ] Scans on iOS camera and Android camera.
- [ ] Scans in low light.
- [ ] Scans while the shirt is worn (not flat on a table).
- [ ] URL short enough that the QR stays visually simple.
- [ ] A visible text cue next to it ("Bump me?" / "What am I here for?").

## Page / funnel path (real phones)

- [ ] `/m/<id>` loads fast on festival-grade mobile network; card renders.
- [ ] "What is this?" opens `/about` carrying `m` and `s`.
- [ ] Tapping "Ask to bump" lands on `/thanks`; a row appears in `bump_request_events`.
- [ ] `/thanks` shows "come back in a month" + the live distinct-people bump-request count.
- [ ] Tapping again from the same device to the same member does not create a second row (per-member dedupe).
- [ ] Opening `/about` directly disables the ask ("Scan a member first"); a forged POST records nothing.
- [ ] The About copy says membership is in-person only; nothing reads as remote signup.

## Instrumentation

- [ ] Each member has a distinct URL and a distinct `/ops/:member` token link.
- [ ] Opening an "unprompted" window tags subsequent scans `unprompted`.
- [ ] "Stop window" returns scans to `unknown`.
- [ ] Test scans (set a `test` window) are excluded from demand metrics.
- [ ] `/ops/export` returns CSV with per-member-context exposure, scans, scans/h, opens, bump requests, rates.
- [ ] No email / IP / user agent / pixel is stored anywhere; only an anonymous `device_id`.

## Run-day procedure

1. Each member opens their `/ops/:member?token=` link.
2. Default to **Start unprompted** while wearing the tee and not soliciting scans.
3. Switch to **after-conversation** / **member-directed** when that's the real condition.
4. Use **test** for your own checks; **Stop window** when off-shift.
5. Keep windows honest — the context is the experiment's validity.

## Freeze (prereg tag)

Only after copy, CTA, QR artwork, bars (BUMP-101 §7), and deployed routes are final:
`git tag bump-101-prereg && git push origin bump-101-prereg`, then record the tag in
`docs/BUMP-101-RESULTS.md`. After the tag: bugfixes fine; copy/CTA/bars/measurement changes are not.
