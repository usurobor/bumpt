# BUMP-050: Admission Protocol

> How a person becomes a member: ask to bump, get accepted in person, receive a receipt.

**Status:** Draft v0.1
**Document role:** Protocol spec — the admission ceremony
**Authority:** BUMP-000 (§5.1 physical admission, §5.2 sponsor accountability, §9.3 join by bump, §17.1 admission proximity)
**Governing question:** What is the exact ceremony by which a new node is admitted?

> This spec operationalizes BUMP-000's admission rule as a concrete v1 ceremony,
> and **proposes resolving BUMP-000 §17.1** (open: which proximity method for v1?)
> in favour of a rotating-QR request/accept flow. The §17.1 ratification is a
> separate constitutional edit to BUMP-000.

---

## 1. The invariant

> A new member only gets in when an existing member accepts them **in person** and
> becomes their **sponsor**.

This is the whole protocol; everything below is mechanism in service of it. NFC,
BLE, QR, and ultrasound are *transports*, not the product. The primitive is
**physical sponsor admission**, never "NFC tap."

Implementation-neutral framing: *membership begins with an in-person bump accepted
by an existing member.*

---

## 2. The ceremony

```
Ask to bump  →  Accept bump  →  Admission receipt
```

Product copy: **Ask to bump** · **Accept bump** · **You're in**.

1. **Scan.** A prospective member scans a member's worn tag and lands on that
   member's card: in-person only; ask this member to bump you in.
2. **Ask to bump.** The prospect taps *Ask to bump*. Their phone creates a
   short-lived, scan-originated `AdmissionRequest` and shows a code / QR / phrase
   for the member to take in. The request expires in 2–5 minutes.
3. **Accept bump.** The member, *with the person in front of them*, accepts. The
   accept screen makes the act explicit: "You are admitting this person into Bump.
   You will be recorded as their sponsor. Only accept if they are with you in
   person." The member takes in the requester's code (scan/enter) so the two phones
   actually meet.
4. **You're in.** Acceptance — and only acceptance — creates an `AdmissionReceipt`.

### Knock vs membership (load-bearing)

A request is **a knock on the door, not membership.** Do not call a request
membership anywhere — copy, schema, or logs. Declined or expired requests create
no standing effect.

---

## 3. Protocol nouns

- `AdmissionRequest` — a short-lived, scan-originated, in-person admission request.
- `AdmissionReceipt` — the sponsor-attested record that admission happened
  (the BUMP-000 §9.3 admission receipt, specialized for the request/accept method).

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
cryptographic proximity, only that an accountable member witnessed and accepted the
person in the room. That is enough for v1. NFC later =
`method: "nfc_challenge"`, `proximity_claim: "proximity_challenge_passed"` — same
primitive, different transport.

---

## 4. MVP schema shape

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

---

## 5. Non-negotiable safeguards

- A request must **originate from scanning a member tag** (no cold requests).
- A request **expires quickly** (2–5 min); expired requests cannot be accepted.
- Acceptance requires the **requester's code present** (the phones meet).
- A member may **never** accept from a random inbox hours later — that is remote
  admission and is forbidden (BUMP-000 §5.1).
- Accepted → receipt. Declined or expired → nothing.

---

## 6. Main risk: request spam (not remote membership)

Anyone can scan visible tags and spam *Ask to bump*. Mitigations: short expiry,
per-member rate limits, per-device anonymous cooldown, a member block button, hide
*Ask to bump* when the member is not accepting, require a requester-present code.
**Spam requests are not membership — they are just knocks.** Do not overbuild this
in v1.

---

## 7. Relationship to BUMP-101

BUMP-101 (the live field experiment) measures **demand**, not membership. It records
the *knock* only: scan → about → *Ask to bump*. Each tap is an
`AdmissionRequest`-shaped signal, perpetually `pending` — there is no accept side in
the experiment. The full **Accept → Receipt** ceremony in this spec is a separate
build.
