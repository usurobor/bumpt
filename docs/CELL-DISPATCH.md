# Cell dispatch — the tag-gated board

How a contract-issue becomes shipped work. Refines the role boundary
(`.cn-sigma/logs/20260616.md`) and §5.2 cell-dispatch (wake=δ=γ, α+β as Agent
sub-agents, receipt at `.cdd/unreleased/{N}/`).

## Principle

**Wake never implements an issue just because it exists.** An issue is a
discussion surface until a human explicitly *arms* it with a label. The label is
the dispatch act — the seam between *authoring* (Σ + human, on `main`) and
*shipping* (the cell, on `dev`).

- **Σ authors** the contract-issue and discusses it with the human.
- **The human arms** it (`cell:dispatch`) — directly, or by telling Σ to apply it.
- **The cell ships** it and moves it across the board, closing with a Receipt.
- **δ (human, or Σ on next wake) accepts** the Receipt and closes, or sends it back.

This is a kanban board where the card is a GitHub issue and the column is a label.

## Labels (the board)

| Label | Column | Applied by | Wake behavior |
|-------|--------|-----------|----------------|
| `cell:draft` | Backlog / Discussion | Σ (on open) | **ignore** — under discussion |
| `cell:ready` | Ready | Σ, on convergence | **ignore** — converged, not yet armed |
| `cell:dispatch` | Dispatched (To Do) | **human** (or Σ on human direction) | **arm** — wake claims it |
| `cell:in-progress` | In Progress | cell (on claim) | working — do not re-pick |
| `cell:review` | Review | cell (on finish, + Receipt) | awaiting δ acceptance |
| `cell:blocked` | Blocked | cell | needs human/Σ input → back to discussion |

Done = issue **closed** by δ after the Receipt is accepted. (Optional flags:
`cell:accepted` on a closed-good issue, `cell:changes` when δ sends it back.)

Only `cell:dispatch` arms the cell. Every other label is inert to wake — so an
issue can be authored, debated, and revised under `cell:draft`/`cell:ready` with
zero risk of auto-execution.

## Lifecycle

```
Σ opens issue
        │  cell:draft
        ▼
  discuss (Σ ↔ human)  ──► converge ──►  cell:ready
        │                                   │
        │            human arms ────────────┤  cell:dispatch
        ▼                                    ▼
  (wake ship intent claims it)
        │  −cell:dispatch  +cell:in-progress
        ▼
  cell runs §5.2: γ=δ launches α+β; builds on dev; Receipt → .cdd/unreleased/{N}/
        │
        ├── done ──►  −cell:in-progress  +cell:review   (+ PR, + Receipt comment)
        │                    │
        │            δ accepts ──► close issue (cell:accepted), merge/promote
        │            δ rejects ──► −cell:review +cell:dispatch (or cell:changes), comment
        │
        └── boundary hit ──► +cell:blocked, comment what's needed → back to discussion
```

## Wake's dispatch rule

Wake's **ship intent** (distinct from the heartbeat/author intents) acts on:

> open issues labeled `cell:dispatch` **and not** `cell:in-progress`.

On claim it atomically swaps `cell:dispatch → cell:in-progress` (so a second wake
won't double-claim — reinforced by the existing `concurrency: claude-wake`
serialization). Triggers:

- `issues: [labeled]` — react immediately when `cell:dispatch` is applied.
- the scheduled sweep (`:05/:20/:35/:50`) — re-scan for any armed-but-unclaimed
  issue, in case a `labeled` event was missed.

This replaces the current title-based trigger (`title contains "claude-wake"`) for
implementation work. The heartbeat/attach wake (scheduled, channel sync) is
unchanged.

## Boundary check

- A human, not wake, decides *when* work starts (applies `cell:dispatch`).
- Σ never sets `cell:in-progress`/`cell:review` (those are the cell's), and never
  ships; Σ may set `cell:draft`/`cell:ready` and, **on human direction**,
  `cell:dispatch`.
- δ (human, or Σ on next wake) is the only one who closes a `cell:review` issue —
  the Receipt crosses the boundary there.

## Status — not yet wired

This spec defines the protocol. Two implementation steps remain, and they ride on
the still-open §5.2 cell-launch entrypoint (the cell-prompt template + foreign-body
dispatch mechanism requested from home):

1. Create the six `cell:*` labels in the repo.
2. Teach `claude-wake.yml` the ship intent (label trigger + the dispatch rule
   above) and the cell-prompt that runs γ→α→β→Receipt over the armed issue.
