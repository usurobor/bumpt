# BUMP-100: MVP Product Requirements (v0.1)

> The smallest buildable slice that proves the Bump kernel: a worn tag + an in-person bump
> make a better, more accountable in-room social surface than swapping handles.

- **Status:** Draft v0.1.0
- **Derives from:** [BUMP-000](./BUMP-000.md) (canonical RFC) — where this PRD and BUMP-000
  disagree, BUMP-000 wins.
- **Audience:** the engineer building v0.1.
- **Governing question:** What is the smallest thing we can build, store, and ship that proves
  the kernel without becoming social media?

Changelog:
- v0.1.0 — initial scope from the founding MVP convergence (two frequencies / two scans /
  current-state-not-history); absorbs the tech-stack and decided-items formerly in `spec/PROJECT.md`.

---

## 1. What the MVP proves

> In one real-world scene, a worn tag plus an in-person sponsor bump creates a more useful and
> accountable social surface than exchanging handles, phone numbers, QR menus, or a group chat.

The MVP proves the **kernel**, not the society. No cells, missions, governance automation, or
standing scores. (BUMP-000 §13.1.)

## 2. The spine (one line)

**Bump is the opposite of social media: ephemeral presence, here and now.** The social surface
is a signal you set for the moment and that disappears; the durable part is *who is accountable
for what* (membership, who vouched you). Success is time *off* the app. The public narrative of
this lives in BUMP-001; this doc is the buildable consequence.

## 3. Scope model

### 3.1 Two kinds of data

| | Kept in MVP? | What |
|---|---|---|
| **Ephemeral** — the live signal | ✅ | What you're here for *right now*. Set per night, expires to static, revocable. Overwritten, never logged. |
| **Current-state facts** | ✅ | Identity (pic, bump name, opaque number), membership, who vouched you, who you've bumped (connection edges). Small, bounded, written at discrete events — **no timeline**. |
| **History** (persistent timeline) | ❌ **non-goal** | Where you've been over time, shared scenes / overlap, activity logs, bump counts. This is the storage blow-up and the surveillance surface; deferred. |

The discriminator is **current state (in) vs history (out)**, not "ephemeral vs persistent." We
persist small current facts; we do not accumulate a timeline.

### 3.2 Two scans (both reads, both in MVP)

| Scan | Who | Sees |
|---|---|---|
| **2.1 by non-bumper** | anyone (anonymous via QR, or a member who hasn't bumped you) | the node card + your live signal |
| **2.2 by bumper** | a member who has bumped you | the same, **plus** "you've bumped" (reads one connection edge) |

2.2 is feasible in MVP because "have we bumped?" reads a single current-state edge, not history.

### 3.3 In / out

**In:** in-person bump (admission + connection) · worn tag → public node card · live signal
(ephemeral, expires) · Radio signal (current Spotify track, optional) · scan resolves a card,
scoped to scanner · tag bind / revoke · admission & tag receipts · node recovery without
standing transfer.

**Out (non-goals):** presence history / "where you've been" · shared scenes / overlap ·
counts (people bumped, mutuals) · geolocation / auto check-in · feed · maintained profiles ·
multiple profiles per context · missions · delegation · cells & governance automation ·
complex standing scores · remote invite links of any kind.

## 4. The node card (what a scan shows)

The card is **mostly current-state facts + one ephemeral signal**. Attributes:

| Field | Kind | Notes |
|---|---|---|
| Pic | current-state | one identity photo (not a gallery) |
| Bump name | current-state | handle, real or nick |
| Signal | **ephemeral** | short text, IG-bubble style ("here to dance"); or static if none |
| Vouched by | current-state | the sponsor edge from admission — **scoped** (below) |
| Number | current-state | **opaque / non-sequential** (see §11), a stable handle |
| Track (Radio) | **ephemeral** | current Spotify track, live-read (≈0 storage); optional, off by default |

**Scanner scoping** (consentful visibility, BUMP-000 §5.3):

| Scanner | Vouched-by | Connection |
|---|---|---|
| non-member (anonymous QR) | "vouched ✓" (no name) | — |
| member (non-bumper) | sponsor name | — |
| member (bumper) | sponsor name | "you've bumped" |

Default signal state is **static** (nothing). A scan never implies follow, contact exchange,
or location.

## 5. Core flows (MVP)

1. **Bump (in person).** The admission ceremony of [BUMP-050](./BUMP-050.md): *ask to bump →
   accept in person → receipt*. If one party is a newcomer → **admission**: creates membership,
   records sponsor, emits a signed AdmissionReceipt. If both are members → **connection**:
   records one bump edge ("we bumped").
   The **static tag QR is scan/discovery only — it does not admit anyone.** Admission requires
   the BUMP-050 ceremony: a short-lived, scan-originated `AdmissionRequest` accepted in person
   by an existing member, followed by an `AdmissionReceipt`. The v1 transport is a
   short-lived request QR/code/phrase accepted in person; NFC/BLE/UWB may harden proximity
   later (BUMP-000 §17.1) but are **not** the product primitive — physical sponsor admission is.
2. **Bind a tag.** Bind a physical tag (QR/NFC) to a node; emit a TagReceipt. Tags are
   replaceable and revocable; a stolen tag grants **no** account control.
3. **Set / expire a signal.** Set the live signal; it shows on scan; it expires to static
   (default end-of-day / event-bounded, exact default §11); revoke is immediate. Setting a new
   signal overwrites — no signal history.
4. **Scan.** Point a phone at a tag → resolve the node card, scoped per §4. Anonymous scan =
   public web card (no app/login required).
5. **Recover.** Recover a node after lost phone/key without transferring standing (BUMP-000 §9.7).

## 6. Data model (current-state only)

Light sketch; formal schemas are **BUMP-010**. No history/timeline tables.

- **Node** — id, public key, opaque number, bump name, pic, sponsor_node_id, created_at.
- **TagBinding** — tag_id, node_id, active.
- **Signal** — node_id, text, optional track ref, scope, expires_at. *Current only — overwritten, not logged.*
- **Connection** — node_a, node_b. The "we've bumped" set (current relational state).
- **AdmissionReceipt** — new_node, sponsor_node, timestamp, proximity_method, signatures.
- **TagReceipt** — tag_id, node_id, bind/revoke, timestamp, signature.

No presence table, no event log, no counts.

## 7. Architecture & stack

Server is a **thin notary** for live signals and bump verification — durable identity and
receipts can later export to git-as-substrate (post-MVP). Policy stays stable; implementation
is volatile (BUMP-000 §15).

- **Supabase** — Postgres, Auth, Realtime, Edge Functions, Storage.
- **Expo** (React Native, iOS + Android) — the member app. NFC/BLE (`expo-nfc`,
  `react-native-ble-plx`) are *optional* proximity hardening, **not** the v1 admission transport
  (which is BUMP-050's short-lived request QR/code accepted in person).
- **Vercel** (Next.js, SSR) — the public Node Page rendered on anonymous QR scan.
- **Spotify Web API** — the Radio signal (current track).

All on free tiers initially. (GitHub-as-backend was considered and rejected, BUMP-000 context.)

## 8. Acceptance criteria

1. A non-member scans a tag's QR and sees the node card (pic, bump name, signal, vouched ✓,
   number, track) with **no app or login**.
2. Membership begins **only** via an in-person bump; an AdmissionReceipt (sponsor + new member
   signed) is produced. **No remote signup path exists** anywhere in the build.
3. Two members can bump to form a connection; a scan by a bumper shows "you've bumped."
4. A member sets a signal → it shows on scan → it expires to static → revoke is immediate.
   Setting a new signal overwrites; no prior signal is retrievable.
5. Radio shows the current Spotify track when enabled; it is **off by default**.
6. A tag can be bound and revoked; a revoked or stolen tag grants **no** account control.
7. **No history is stored or shown**: no presence log, no shared-scenes, no bump/mutual counts.
8. The number is **opaque** (non-sequential) and cannot be moved between nodes.
9. Card scoping holds: non-member → "vouched ✓"; member → sponsor name; bumper → "you've bumped."
10. Lost-phone recovery works without transferring standing.

## 9. Success / failure (one scene, ~6 months)

**Success:** 100–300 members, all admitted by verified in-person bump; >70% bind & wear a tag at
least once; >50% set/update a signal during an event; scanners understand the card unaided; new
members can name their sponsor; lost-tag/lost-phone recovery works without standing transfer; zero
operator-controlled monetization on Node Pages.

**Failure:** used as a linktree; members ask for remote invites; signals feel unsafe to publish;
membership becomes a status flex; scanners see too much by default.

## 10. Constitutional checks (how the MVP honors BUMP-000 §5)

- **Physical admission only** — the only join path is the bump; no remote signup; QR is scan-only.
- **Consentful visibility** — default static; scanner-class scoping; signals revocable.
- **Non-transferable standing** — opaque number, membership bound to node keys; recovery ≠ transfer.
- **No internal currency** — no tokens/ads/boosts; commerce is goods-only via the marketplace (BUMP-040/BUMP-070); money never buys standing.
- **Receipts as evidence** — admission & tag receipts signed and inspectable.
- **Forkable commons** — protocol/schemas public; private member data not forked (full forkability post-MVP).

## 11. Open decisions

- **Signal expiry default** — end-of-day vs event-bounded vs fixed N hours. (Default state = static is decided.)
- **Number** — **decided: opaque/non-sequential.** No sequential vanity numbers (ICQ-style numbers became tradeable status — collides with non-transferable standing, §5.4).
- **Sponsor visibility** — MVP cut: non-members see "vouched ✓", members see the name (BUMP-000 §17.2 remains open beyond MVP).
- **Proximity method for the bump** — v1 is BUMP-050's short-lived request QR/code accepted in person (sponsor-attested); NFC/BLE/UWB are later hardening, not required for v1 (§17.1; iOS phone-to-phone NFC restrictions noted).
- **Genesis** — who admits the first member (BUMP-000 open question).
