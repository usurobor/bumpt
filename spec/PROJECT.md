# Project binding — bumpt

Version: 1.0.0

Changelog:
- v1.0.0 — initial seed; project constitution extracted from the retired Tau persona into
  its correct layer (layer 4, project binding) per Sigma's five-layer chain.

**Pattern:** This file is the bumpt **project binding** — the layer-4 facts an engineer needs
to operate coherently on this project, independent of which engineer (Sigma) operates here.
**Relation:** Identity is at `spec/PERSONA.md` → cn-sigma; this file is project context only.
**Exit:** Canonical product intent is the BUMP doc stack (BUMP-000 is source of truth). Where
this file and BUMP-000 disagree, BUMP-000 wins and this file is patched.

---

## What bumpt is

Bump is an **in-person social admission protocol with a worn, consentful social surface**.
Members wear a physical Tag (QR + NFC). Anyone can scan it and see the member's current
opt-in Signal, starting with what they're listening to. Membership begins only through an
in-person, phone-to-phone sponsor bump.

- Wordmark / domain: `bumpt` / `bumpt.io` (the "t" is the visual mark). Spoken/in-text: "Bump".
- Verb forms: "bump in", "get bumpt in". Protocol formal name: Bump.

## Invariants (constitutional — not the engineer's to relax)

1. **In-person admission only.** Membership begins *only* via phone-to-phone sponsor bump:
   NFC + UWB/BLE proximity proof. No remote signup, invite links, email codes, or QR-based
   admission (QR is screenshottable — it breaks the rule). Every member has a sponsor whose
   standing reflects the conduct of their downstream branch.
2. **Non-transferable standing.** Reputation can't be bought, sold, lent, or merged.
3. **Consentful visibility.** Default private. A scanner sees *only* what the member chose to
   expose to that scanner class at that moment — not "what you're doing right now."
4. **No monetization surface.** No internal currency, tokens, ads, or paid boosts. Zero
   operator-controlled monetization on Node Pages.
5. **Forkable commons.** Protocol, schemas, and governance history are public and forkable.
6. **Receipts as evidence.** Every consequential action produces a signed, inspectable receipt.

## Four core surfaces

**Tag** (worn QR + NFC) · **Bump** (in-person admission ceremony; NFC + UWB/BLE proximity
proof) · **Signal** (consentful, scoped, time-bounded, revocable emission) · **Receipt**
(signed evidence layer for membership, conduct, standing, governance).

## Primitives (durable nouns — do not add without a demonstrated composition failure)

Node · Tag · Signal · Bump (ceremony) · Admission Capability (copy: "Bump pass") · Receipt ·
Standing · Cell · Mission · Delegation.

## Doc stack

| Doc | What it is | State |
|-----|------------|-------|
| BUMP-000 | Protocol Inception RFC | **canonical** — Draft v0.4 (not yet in this repo) |
| BUMP-001 | PR/FAQ — public launch narrative | next deliverable; seed in BUMP-000 §18 |
| BUMP-010 | Protocol Spec — schemas + FSM tables | pending |
| BUMP-020 | Threat Model | required pre-launch |
| BUMP-030 | Governance Constitution | can wait to ~v0.4 |
| BUMP-100 | MVP PRD | pending |

## v0.1 scope guardrails

**Build only:** member accounts with on-device keypair; physical Bump-In (NFC + UWB/BLE);
worn tag → public Node Page; live Radio signal via Spotify; phone-controlled visibility
(off / public / bump-only / circle / event / delayed); tag rotation + revocation; manual
steward console for disputed admissions.

**Do not build yet:** feeds, missions, governance voting, leaderboards, marketplace, tokens,
remote invite links of any kind, multi-cell governance, complex standing scores, audio streaming.

**v0.1 success (one city, 6 months):** 100–300 members, all admitted via verified physical
bump; >70% bind+wear a tag once; >50% publish/update a signal during an event; scanners
understand the node card unaided; new members can name their sponsor; lost-tag/lost-phone
recovery works without standing transfer; zero monetization surfaces on Node Pages.

**v0.1 failure:** used as a linktree; members ask for remote invites; signals feel unsafe to
publish; membership becomes a status flex rather than scene utility.

## Tech stack (v0.1)

Supabase (Postgres/Auth/Realtime/Edge Functions/Storage) · Expo (RN, iOS+Android;
`expo-nfc`, `react-native-ble-plx`) · Vercel (Next.js, public Node Pages, SSR) · Spotify Web
API (first signal). Free tiers initially. Server is a **thin notary** for live signals and
bump verification; durable identity/receipts/standing can later export to git-as-substrate
(post-MVP). GitHub-as-backend was considered and rejected.

## Posture

Not venture-scale; do not pitch it as one. Value is inversely proportional to growth rate.
One city, slow, dense, real. Funding: grants, dues, patron capital, or a sponsoring
institution — not VC. Co-op / art project / protocol foundation.

## Decided — not open unless the operator reopens

Visibility = consentful scanner-class exposure (not universal live view) · claim =
"remote-spam-resistant", not "un-spammable" · naming = "Admission capability" (spec) /
"Bump pass" (copy) · governance levels = constitutional / protocol / cell · stack = Supabase
+ Expo + Vercel + Spotify.

## Open questions (do not pretend to resolve)

Genesis (who bumps the first member) · iOS phone-to-phone NFC restriction → likely
NFC-trigger → BLE handshake → UWB confirm · sponsor-lineage visibility vs surveillance ·
which standing vectors come first · default delay on public presence receipts · cell quota
authority before cells exist · legal/financial shell (co-op / foundation / LLC).
