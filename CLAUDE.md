# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

**bumpt** is the project hub for Bump — an in-person social admission protocol. The repo currently holds **protocol documents only**; no client, server, or tag implementation has been built. `docs/BUMP-000.md` is the source of truth for everything.

## Document stack

| File | Role | Status |
|------|------|--------|
| `docs/BUMP-000.md` | Protocol Inception RFC — canonical intent, non-negotiable principles, primitives, threat model | Draft v0.4 |
| `docs/BUMP-100.md` | MVP PRD — smallest buildable slice (derives from BUMP-000; BUMP-000 wins on conflict) | Draft v0.1 |
| BUMP-001 | PR/FAQ — public launch narrative | planned |
| BUMP-010 | Protocol Spec — formal Node/Tag/Signal/Receipt schemas | planned |
| BUMP-020 | Threat Model | planned (pre-launch requirement) |
| BUMP-030 | Governance Constitution | planned |

When adding new documents, follow the BUMP-NNN naming convention and cross-reference BUMP-000 as authoritative.

## Planned tech stack (BUMP-100 §7)

Once build begins:
- **Supabase** — Postgres, Auth, Realtime, Edge Functions, Storage
- **Expo** (React Native, iOS + Android) — mobile app; `expo-nfc`, `react-native-ble-plx` for the bump handshake
- **Vercel / Next.js** (SSR) — public Node Page rendered on anonymous QR scan
- **Spotify Web API** — Radio signal (current track)

All initially on free tiers. No code exists yet.

## Protocol invariants (constitutional — never work around these)

From BUMP-000 §5. Any build decision that violates these is wrong:

1. **Physical admission only** — the only join path is an in-person phone-to-phone bump; no remote signup, no invite links, no QR-for-admission (QR is scan/discovery only).
2. **Consentful visibility** — default is private/static; every signal is opt-in, scoped, revocable.
3. **Non-transferable standing** — node numbers are opaque and non-sequential; recovery ≠ transfer.
4. **No internal currency** — no tokens, ads, paid boosts, or tradable reputation units.
5. **Receipts as evidence** — admission, tag, and governance actions produce signed receipts.
6. **Forkable commons** — protocol, schemas, and governance history are public; private user data is not forked.

## AI agent activation (Sigma at bumpt)

This repo is a **foreign activation body** for Sigma, the cnos engineering persona. bumpt carries no identity files of its own — identity is canonical at `cn-sigma`.

**Activation load order** (from `README.md`):
1. **Soul** — Kernel + CAP + CLP from `cnos:src/packages/cnos.core/` (clone or gh API)
2. **Identity** — `cn-sigma:spec/PERSONA.md` + `cn-sigma:spec/OPERATOR.md`
3. **Project** — read `docs/BUMP-000.md` locally
4. **Confirm** — who/whom/where/what
5. **Attach** — append to `.cn-sigma/logs/YYYYMMDD.md`

The canonical activate skill: `cnos:src/packages/cnos.core/skills/agent/activate/SKILL.md`

### `.cn-sigma/logs/` channel

- One file per day: `YYYYMMDD.md`, append-only within the day
- Each entry carries a YAML front-matter block (`at`, `mode`, `cursor_in`, `cursor_out`, `class`) followed by a prose summary
- `cursor_out` is the HEAD SHA of `cn-sigma` at the time of activation
- The home-side cursor lives in `cn-sigma:state/activations.md` → `last_read_foreign_log`
- Class `heartbeat` = no actionable directives; `directive` = operator instruction present

### Wake workflow

`.github/workflows/claude-wake.yml` fires on schedule (`:05/:20/:35/:50` past each hour) and on `claude-wake` issue titles. Concurrency group `claude-wake` with `cancel-in-progress: false` serializes wakes — never run two in parallel. Wake permissions are inline in the workflow file, not in `.claude/settings.json`.
