# Bump

> An in-person social admission protocol with a worn, consentful social surface.

**Status:** 0.0.1 · live field experiment ([bumpt.io](https://bumpt.io)) · pre-MVP

Bump lets people you meet in the room discover your current, opt-in social signal through a
worn tag. You wear a small tag — a QR/NFC sticker, pin, or patch. Anyone can scan it, but
they see **only what you've chosen to show them, right now**. The default is private.

The one move that defines Bump: **membership can only begin through an in-person sponsor
bump** — you ask a member to bump you in, and an existing member accepts, in person. No signup
page, no invite link, no email code. If you weren't there in person, you're not in.

> Move the social object from the feed to the worn tag.

Bump is not trying to build a better feed. It's a **forkable protocol for real-world scenes** —
shows, salons, conferences, campuses, studios, gyms, pop-ups — where people who share physical
space want a lightweight, accountable way to present current intent and admit new members
without handing the scene to a platform.

## Why Bump exists

Today's social tools were built for remote attention markets. In a physical room they answer
the wrong questions. Bump starts from different primitives.

| The problem | What Bump does instead |
|-------------|------------------------|
| Feeds exhaust people; attention is the product | A worn tag shows a current, opt-in signal — not an endless stream |
| Bots and spam scale because signup is free | Admission costs an in-person bump from an accountable sponsor |
| Status can be bought; reputation is a transferable number | Standing is **non-transferable**, derived from signed receipts |
| "Public by default" turns visibility into risk | Visibility is **consentful**: scoped, time-bounded, revocable, private by default |
| Communities are locked to a vendor and can't leave | Protocol, schemas, and governance are a **forkable commons** |

Honest scope: this makes Bump **remote-spam-resistant**, not "un-spammable." It raises the
social, physical, and sponsor cost of joining — it doesn't claim to make abuse impossible.

## How it works

Everything composes from four surfaces:

- **Tag** — the worn physical interface (QR + NFC) that points to your node.
- **Bump** — the in-person admission ceremony ([BUMP-050](./docs/BUMP-050.md)): ask to bump →
  an existing member accepts in person → a signed receipt admits the new member. Asking is only
  a knock; acceptance is membership.
- **Signal** — your current, consentful emission: *"open to talk shop," "here to dance, not
  network," "do not approach."* Scoped to who may see it, time-bounded, revocable.
- **Receipt** — the signed, inspectable evidence layer for membership, conduct, standing, and
  governance. Claims without receipts are conversation, not protocol evidence.

A scan answers *"who are you here as, and is interaction welcome?"* — nothing more than you
chose to expose. It does not imply a follow, a contact exchange, or your location.

## Principles (non-negotiable)

These are constitutional — change one and it's a different product:

1. **Physical admission only** — membership begins solely through an in-person sponsor bump.
2. **Sponsor accountability** — every member has a sponsor who witnessed their entry.
3. **Consentful visibility** — private by default; you expose only what you choose, when you choose.
4. **Non-transferable standing** — reputation can't be bought, sold, lent, or merged.
5. **Receipts as evidence** — consequential actions produce signed, inspectable receipts.
6. **No internal currency** — no tokens, ads, or paid boosts; money never buys standing.
7. **Forkable commons** — the protocol and its governance history are public and forkable.
8. **Local cells, global minimums** — scenes self-govern, but never below the constitutional floor.

## Documents

The canonical document stack lives under [`docs/`](./docs/).

**Product / protocol**

| Doc | What it is | Status |
|-----|------------|--------|
| [BUMP-000](./docs/BUMP-000.md) | Protocol Inception RFC — what Bump is and what must never change | **Draft v0.4** (canonical) |
| BUMP-001 | PR/FAQ — the public launch narrative | planned |
| BUMP-010 | Protocol Spec — Node, Tag, Signal, Receipt, Standing schemas | planned |
| BUMP-020 | Threat Model — relay, coercion, tag theft, stalking, recovery | planned (pre-launch) |
| BUMP-030 | Governance Constitution — cells, forks, maintainers, rule changes | planned |
| [BUMP-040](./docs/BUMP-040.md) | Revenue Constitution — marketplace fee, open-source software, money never buys standing | **Draft v0.2** |
| [BUMP-050](./docs/BUMP-050.md) | Admission Protocol — ask to bump, accept in person, issue receipt | **Draft v0.1** |
| [BUMP-060](./docs/BUMP-060.md) | Node Control and Recovery — passkey-first login; email optional, never identity | **Draft v0.1** |
| [BUMP-070](./docs/BUMP-070.md) | Marketplace — members sell QR-embedded goods; platform fee; software open; buying never buys standing | **Draft v0.1** |
| [BUMP-100](./docs/BUMP-100.md) | MVP PRD — the first buildable product slice | **Draft v0.1** |
| [BUMP-101](./docs/BUMP-101.md) | Stone Techno field experiment — worn-QR pre-MVP test | **Draft v0.1.3** |
| [BUMP-101-RESULTS](./docs/BUMP-101-RESULTS.md) | Field experiment outcome (pre-registered, filled post-event) | awaiting event |

**Operations / agent**

| Doc | What it is |
|-----|------------|
| [DEVELOPMENT](./docs/DEVELOPMENT.md) | Branch model, CI gate, dev → deploy → Vercel flow |
| [CELL-DISPATCH](./docs/CELL-DISPATCH.md) | Tag-gated cell dispatch board (internal operating guide) |
| [RFC-cell-dispatch](./docs/RFC-cell-dispatch.md) | External-review RFC for the dispatch model |
| [CI-TELEGRAM](./docs/CI-TELEGRAM.md) | CI/CD Telegram notification setup |

Start with **[BUMP-000](./docs/BUMP-000.md)** (source of truth for intent) and
**[BUMP-050](./docs/BUMP-050.md)** (how admission works in v1).

## Status

**0.0.1 — live field experiment, pre-MVP.** Bump 0.0.1 is live at [bumpt.io](https://bumpt.io)
as the [BUMP-101](./docs/BUMP-101.md) field experiment: scan a member card, read the rule, tap
**Ask to bump**. A tap is a *knock*, not membership — it records an anonymous, aggregate signal
of demand and nothing more. The throwaway app lives under [`experiment/`](./experiment/) and
ships through the gated `dev → deploy → Vercel` pipeline (see [DEVELOPMENT](./docs/DEVELOPMENT.md)).

The **MVP is not built.** The accept-in-person ceremony ([BUMP-050](./docs/BUMP-050.md)),
receipts, tag binding, live signals, recovery, and standing all remain future work (scoped in
BUMP-000 §13 and BUMP-100). The intended first proof: in **one city, within six months**,
100–300 members who all joined by verified in-person bump, wearing tags and publishing signals
at real events.

This is deliberately **not** venture-scale — one city, slow, dense, real; funded by a
**marketplace fee** on member goods, never by ads or selling standing, with the software kept
open source (see [BUMP-040](./docs/BUMP-040.md), [BUMP-070](./docs/BUMP-070.md)).

## Contributing

Bump is a forkable commons, and the protocol is shaped in the open. The most useful early
contributions are sharp readings of **[BUMP-000](./docs/BUMP-000.md)**: where is the threat
model thin, where could the admission handshake be relayed, where might a signal feel unsafe
to publish? Governance has three levels — constitutional, protocol, and cell — and changes to
the constitutional principles above are intentionally hard to make. (A formal contribution
guide arrives with BUMP-030.)

## For AI agents

This repo is also a working hub: it is engineered by **Sigma**, the cnos engineering persona,
*attached* to bumpt. bumpt is a foreign activation body — it carries **no identity files of
its own**. Identity is canonical at the [cn-sigma](https://github.com/usurobor/cn-sigma) home
hub; the only Sigma surface here is the `.cn-sigma/logs/` activation channel.

If you are an agent told *"activate and attach as `https://github.com/usurobor/bumpt`"*, follow
the cnos activation skill — defined once in cnos, not duplicated here:

- **Canonical:** `src/packages/cnos.core/skills/agent/activate/SKILL.md`
- **Raw:** `https://raw.githubusercontent.com/usurobor/cnos/main/src/packages/cnos.core/skills/agent/activate/SKILL.md`

Load order: **soul** (Kernel + CAP + CLP, from cnos) → **identity** (Sigma, from
[`cn-sigma/spec/`](https://github.com/usurobor/cn-sigma/tree/main/spec)) → **project** (read
[`docs/BUMP-000.md`](./docs/BUMP-000.md)) → **confirm** who/whom/where/what → **attach** via the
`.cn-sigma/logs/` channel (see [`.cn-sigma/logs/README.md`](./.cn-sigma/logs/README.md)). Pick
the load tier your environment supports; don't improvise the order.

## License & commons

The protocol, schemas, governance history, **and the software** are a **forkable, open-source
commons** — public, inspectable, and survivable beyond any single operator. Private member data
is not part of the commons and is not forked by default. The software is open source (proposed
license: **AGPL-3.0**, so it stays open even when run as a hosted service); the license is being
finalized. Revenue comes from a **marketplace fee** on member goods, never from the software or
from selling standing ([BUMP-040](./docs/BUMP-040.md), [BUMP-070](./docs/BUMP-070.md)).
