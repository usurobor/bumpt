# BUMP — admission protocol

Status: founding primitive (v1). This document defines *how someone becomes a
member*. It supersedes any earlier framing that tied admission to NFC.

## The invariant

> A new member only gets in when an existing member accepts them **in person**
> and becomes their **sponsor**.

This is the whole protocol. Everything below is mechanism in service of this one
rule. NFC, QR, BLE, ultrasound are *transports*, not the product. The primitive
is **physical sponsor admission**, never "NFC tap".

Old framing (do not use): "membership begins with a physical phone-to-phone touch".
Correct framing: **"membership begins with an in-person bump accepted by an existing member."**

## The ceremony

```
Ask to bump  →  Accept bump  →  Admission receipt
```

Product copy: **Ask to bump** · **Accept bump** · **You're in**.

1. **Scan.** A prospective member scans a member's worn tag and lands on that
   member's card. The card states: in-person only; ask this member to bump you in.
2. **Ask to bump.** The prospect taps *Ask to bump*. Their phone creates a
   short-lived, scan-originated **AdmissionRequest** and shows a code/QR/phrase
   for the member to take in. The request expires in 2–5 minutes.
3. **Accept bump.** The member, *with the person in front of them*, accepts. The
   accept screen makes the act explicit: "You are admitting this person into Bump.
   You will be recorded as their sponsor. Only accept if they are with you in
   person." The member takes in the requester's code (scan/enter) so the two
   phones actually meet.
4. **You're in.** Acceptance — and only acceptance — creates an **AdmissionReceipt**.

### Knock vs membership (load-bearing)

A request is **a knock on the door, not membership.** Do not call a request
membership anywhere — copy, schema, or logs. Declined/expired requests create no
standing effect.

## Protocol nouns

- `AdmissionRequest` — a short-lived, scan-originated, in-person admission request.
- `AdmissionReceipt` — the sponsor-attested record that admission happened.

```
AdmissionReceipt {
  sponsor_node_id
  new_node_id
  admission_request_id
  scan_id
  method            // v1: "qr_request_accept"
  proximity_claim   // v1: "sponsor_attested"
  created_at
  ruleset_version
  sponsor_signature
  new_member_signature
}
```

`proximity_claim = "sponsor_attested"` is the v1 claim: we are **not** asserting
cryptographic proximity, only that an accountable member witnessed and accepted
the person in the room. That is enough for v1. NFC later =
`method: "nfc_challenge"`, `proximity_claim: "proximity_challenge_passed"` — same
primitive, different transport.

## MVP schema shape (for the real ceremony)

```
nodes
tags
scan_events
admission_requests   // states: pending | accepted | declined | expired | blocked
admission_receipts
```

```
admission_requests {
  id, sponsor_node_id, pending_node_id, scan_id,
  created_at, expires_at, status, request_code_hash, requester_public_key
}
```

## Non-negotiable safeguards

- A request must **originate from scanning a member tag** (no cold requests).
- A request **expires quickly** (2–5 min); expired requests cannot be accepted.
- Acceptance requires the **requester's code present** (the phones meet).
- The member can **never** accept from a random inbox hours later — that is
  remote admission and is forbidden.
- Accepted → receipt. Declined/expired → nothing.

## Main risk: request spam (not remote membership)

Anyone can scan visible tags and spam *Ask to bump*. Mitigations: short expiry,
per-member rate limits, per-device anonymous cooldown, a member block button,
hide *Ask to bump* when the member isn't accepting, require requester-present
code. **Spam requests are not membership — they are just knocks.** Do not
overbuild this yet.

## What the live experiment (BUMP-101) does today

BUMP-101 measures **demand**, not membership. It records the *knock* only:
scan → about → *Ask to bump*. Each tap is an `AdmissionRequest`-shaped signal
(perpetually `pending` — there is no accept side in the experiment). It is
anonymous (one first-party id to dedupe taps; no PII) and the result is
aggregate. The full **Accept → Receipt** ceremony above is built separately (CDD
cell) and is not part of the experiment.
