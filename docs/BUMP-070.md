# BUMP-070: Marketplace

> Any member can sell QR-embedded goods on Bump. The platform takes a fee. The software stays open. Buying is never required and never buys standing.

**Status:** Draft v0.1
**Document role:** Commerce spec — the member marketplace
**Authority:** BUMP-000 (invariants) · BUMP-040 (revenue) · BUMP-050 (admission)
**Governing question:** How can any member sell goods on Bump without commerce buying membership, standing, or replacing the in-person door?

> This is a **commerce layer on top of** the protocol. It changes how Bump (the
> company) makes money; it does **not** change how someone becomes a member.

---

## 1. Core

- **Any member may sell** on the Bump marketplace.
- They may sell **anything QR-embedded** — physical or digital artifacts that carry a
  Bump QR (stickers, tees, pins, tags, prints, …).
- Bump-the-company **provides the marketplace and takes a fee** on sales. That is the
  revenue model.
- The **software is open source** (free as in speech). The fee is for the hosted
  marketplace service — never a software licence.

## 2. The QR is the through-line

Every marketplace good carries a Bump QR that resolves to a node-controlled surface
(the seller's node / the product page). The QR is **scan/discovery only — never
admission** (BUMP-000 §9.3). So goods double as discovery surfaces: a sold sticker or
tee propagates the network when scanned, exactly like a worn tag. Commerce and reach
are the same motion.

## 3. Buying is open; selling is members-only

- **Sellers** must be members — admitted in person (BUMP-050).
- **Buyers** can be anyone — the storefront is public. "Sign in to buy" is a
  **storefront account, not membership.** Buying never makes you a member.

## 4. What money cannot do

A purchase buys **goods only**. It does **not** create or improve membership, standing,
admission, visibility, sponsor capacity, or governance rights. Selling volume confers
no standing. **No one is ever required to buy anything** to join, remain, or rank.
(Reaffirms BUMP-040 §1/§4/§9 and BUMP-000 §5.)

## 5. Revenue & openness

- Company revenue = a transparent **marketplace fee** on sales.
- Operators may be paid for approved work; every batch/payment/allocation emits a
  receipt (BUMP-040 §7–§8).
- The software is **open source and never licensed for money.** Proposed licence:
  **AGPL-3.0** — keeps it open even when run as a hosted service (see the README
  licence decision).
- This is the revenue model in **BUMP-040 §5**, which replaced the earlier
  "commons surplus / treasury" framing. BUMP-040's **prohibitions stand**.

## 6. Invariants preserved (unchanged)

- **In-person admission only** — membership begins with an in-person bump (BUMP-000
  §5.1; BUMP-050). The marketplace opens no remote door.
- **Consentful visibility · non-transferable standing · receipts as evidence ·
  forkable, open-source commons** (BUMP-000 §5, #7) — all intact.

## 7. Open questions

- Fee size and structure.
- Seller onboarding: a member becomes a seller (payout, tax/KYC).
- Physical vs digital goods; fulfillment.
- Whether a buyer's storefront account relates to a node at all *(lean: fully separate — buying ≠ node)*.
- Licence ratification (AGPL?) — tracked in the README.
