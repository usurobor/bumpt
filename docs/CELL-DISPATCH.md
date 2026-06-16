# Cell dispatch — the agile board

How a contract-issue becomes shipped work. Refines the role boundary
(`.cn-sigma/logs/20260616.md`) and §5.2 cell-dispatch (wake=δ=γ, α+β as Agent
sub-agents, receipt at `.cdd/unreleased/{N}/`).

> Status: **draft, under discussion** — naming settled on `status:` / agile
> columns; open questions in the last section. No labels created and `claude-wake.yml`
> untouched until the design converges and home hands down the cell-launch entrypoint.

## Principle

**Wake never implements an issue just because it exists.** An issue is a
discussion surface until a human explicitly *commits* it to work by moving it to
**To Do**. That move is the dispatch act — the seam between *authoring* (Σ +
human, on `main`) and *shipping* (the cell, on `dev`).

It's a kanban board where the card is a GitHub issue, the column is a `status:`
label, and the human is the PO who decides what enters **To Do**:

- **Σ authors** the contract-issue (Backlog) and refines it with the human (Ready).
- **The human commits** it to **To Do** — directly, or by telling Σ to label it.
- **The cell ships** it: To Do → In Progress → Review, closing with a Receipt.
- **δ (human, or Σ on next wake) accepts** the Receipt and closes (Done), or sends
  it back.

## Labels (the board)

| Label | Column | Applied by | Wake behavior |
|-------|--------|-----------|----------------|
| `status:backlog` | Backlog | Σ (on open) | **ignore** — under discussion |
| `status:ready` | Ready | Σ, on convergence | **ignore** — refined, not committed |
| `status:todo` | To Do | **human** (or Σ on human direction) | **claim** — the dispatch gate |
| `status:in-progress` | In Progress | cell (on claim) | working — do not re-pick |
| `status:review` | Review | cell (on finish, + Receipt) | awaiting δ acceptance |
| `status:blocked` | Blocked | cell | needs human/Σ input → back to discussion |

**Done** = the issue is **closed** by δ once the Receipt is accepted (no separate
label; open/closed is the Done axis). Sending work back = `status:review →
status:todo` with a comment.

Only `status:todo` arms the cell. Every other label is inert to wake — so an issue
can be authored, debated, and revised under `status:backlog`/`status:ready` with
zero risk of auto-execution.

## Lifecycle

```
Σ opens issue
        │  status:backlog
        ▼
  refine (Σ ↔ human)  ──► converge ──►  status:ready
        │                                   │
        │          human commits ───────────┤  status:todo   (the dispatch gate)
        ▼                                    ▼
  (wake ship intent claims it)
        │  −status:todo  +status:in-progress
        ▼
  cell runs §5.2: γ=δ launches α+β; builds on dev; Receipt → .cdd/unreleased/{N}/
        │
        ├── done ──►  −status:in-progress  +status:review   (+ PR, + Receipt comment)
        │                    │
        │            δ accepts ──► close issue (Done), merge/promote
        │            δ rejects ──► −status:review +status:todo, comment
        │
        └── boundary hit ──► +status:blocked, comment what's needed → back to discussion
```

## Wake's dispatch rule

Wake's **ship intent** (distinct from the heartbeat/attach intent) acts on:

> open issues labeled `status:todo` **and not** `status:in-progress`.

On claim it atomically swaps `status:todo → status:in-progress` (so a second wake
won't double-claim — reinforced by the existing `concurrency: claude-wake`
serialization). Triggers:

- `issues: [labeled]` — react immediately when `status:todo` is applied.
- the scheduled sweep (`:05/:20/:35/:50`) — re-scan for any committed-but-unclaimed
  issue, in case a `labeled` event was missed.

This replaces the current title-based trigger (`title contains "claude-wake"`) for
implementation work. The heartbeat/attach wake (scheduled, channel sync) is
unchanged.

## Boundary check

- A human, not wake, decides *when* work starts (moves the card to To Do).
- Σ never sets `status:in-progress`/`status:review` (those are the cell's), and
  never ships; Σ may set `status:backlog`/`status:ready` and, **on human
  direction**, `status:todo`.
- δ (human, or Σ on next wake) is the only one who closes a `status:review` issue —
  the Receipt crosses the boundary there.

## Open questions (for discussion)

1. **Is To Do the right gate?** It's agile-native (human commits the card → the
   cell, as "the dev", picks it up). Alternative: keep a distinct `status:dispatch`
   so "committed to work" and "go now" are separate. I lean To Do — fewer states.
2. **Backlog vs Ready — keep both, or collapse?** Backlog = unrefined,
   Ready = refined-but-not-committed. They earn their keep only if we want a
   visible "this is agreed, just not scheduled" column. Otherwise drop Backlog
   (un-labeled = backlog).
3. **Done as close vs `status:done` label.** Proposed: closing the issue *is* Done.
   A label would only add board-column visibility on closed issues. Worth it?
4. **Rejection path.** `review → todo` (re-arm, simplest) vs a dedicated
   `status:changes` so a kickback reads differently from a fresh commit.
5. **Blocked's return.** When the cell sets `status:blocked`, does it drop
   `in-progress` (card leaves the doing column) or keep it (still owned, just
   stalled)? I lean: drop in-progress, so Blocked is a clean "back to you" state.
