# RFC: Tag-gated dispatch of AI implementation agents

**Status:** Draft — seeking external review
**Audience:** A reviewer with no prior knowledge of our system
**Date:** 2026-06-16

---

## TL;DR

We run a software project where some work is implemented by an autonomous AI
agent that wakes on a schedule (and on GitHub events). We want a **safe, legible
control surface** for *when* that agent is allowed to start implementing a piece
of work — so that an issue can be authored and debated by humans without the
agent ever jumping in to build it prematurely.

The proposal: **a GitHub issue is a kanban card; its status label is the column;
and the agent only starts building when a human moves the card into "To Do."**
A separate "planning" agent authors and refines the issue but never implements.

We'd like review of (a) whether this control model is sound and (b) five specific
design decisions listed at the end.

---

## Context (the actors)

Three roles operate on one GitHub repository:

1. **Human operator** — the product owner. Decides *what* gets built and *when*
   work may start.
2. **Planner** — an AI agent that writes specifications and GitHub issues, and
   discusses them with the human. It works only on the docs/spec branch (`main`).
   **It never writes implementation code.**
3. **Implementer ("the cell")** — an AI agent, woken by a scheduled job, that
   takes a fully-specified issue and *ships* it: writes code on a code branch
   (`dev`), runs CI, and reports back. It runs as a self-reviewing unit (one
   sub-agent produces code, another reviews it, then it closes out with a written
   summary of what it did — a "receipt").

The repository is **branch-disjoint by file**: specs live on `main`, application
code on `dev`, deployed code on `deploy`. (This detail isn't essential to the RFC
but explains why the planner and implementer don't step on each other.)

The implementer is triggered by a **scheduled "wake" job** (GitHub Actions cron,
a few times per hour) plus GitHub issue events. Today that wake is a no-op
heartbeat; we are designing the mechanism by which it would pick up and implement
work. **This RFC is that mechanism's control surface — not the agent internals.**

> **Glossary (our internal terms → this RFC):** *Sigma / the foreign body* =
> Planner. *Cell* = Implementer. *Wake* = the scheduled trigger job. *δ/γ/α/β* =
> roles inside the implementer (boundary-keeper / closer / producer / reviewer).
> *Receipt* = the implementer's written record of completed work. These are not
> needed to review the RFC; they're here only so our team can cross-reference.

---

## Problem

An issue tracker mixes two very different things:

- **Discussion / specification** — an issue that is still being written, debated,
  or refined. No one should build it yet.
- **Committed work** — an issue that has been agreed and is ready to be built.

If an autonomous implementer simply "picks up open issues," it cannot tell these
apart, and risks building something half-specified or still under debate. We need
an explicit, human-controlled signal that flips an issue from "talk about it" to
"build it" — and a way for the implementer to report progress back onto the same
card.

Constraints / goals:

- **Human-gated start.** Work must not begin without a deliberate human act.
- **Legible state.** Anyone glancing at the board should see what's being
  discussed, what's committed, what's in progress, and what's waiting on review.
- **No double-execution.** Two overlapping wake cycles must not both claim the
  same issue.
- **Minimal ceremony.** As few states as do the job.

---

## Proposal

Model the issue tracker as a kanban board using GitHub **labels** as columns.

### Labels (columns)

| Label | Column | Who sets it | Implementer behavior |
|-------|--------|-------------|----------------------|
| `status:backlog` | Backlog | Planner (on open) | ignore — under discussion |
| `status:ready` | Ready | Planner, once refined | ignore — agreed, not yet committed |
| `status:todo` | To Do | **Human** (or Planner on human instruction) | **claim & build** — the dispatch gate |
| `status:in-progress` | In Progress | Implementer (on claim) | working; don't re-pick |
| `status:review` | Review | Implementer (when done, with receipt) | awaiting human/planner acceptance |
| `status:blocked` | Blocked | Implementer | needs human input; returns to discussion |

**Done** = the issue is **closed** after its result is accepted (open/closed is
the Done axis; no separate label).

The single rule that matters: **only `status:todo` causes the implementer to
start.** Everything else is inert to it. So an issue can sit in Backlog/Ready
being authored and argued over indefinitely with no risk of premature execution.

### Lifecycle

```
Planner opens issue ─ status:backlog
        │
   refine with human ─► status:ready
        │
   human commits ─────► status:todo        ← the only state that starts a build
        │
   implementer claims ─ status:todo → status:in-progress (atomic swap)
        │
   builds on code branch, runs CI, writes a receipt
        │
        ├─ success ─► status:in-progress → status:review  (+ pull request, + receipt)
        │                 │
        │           human accepts ─► close issue (Done)
        │           human rejects ─► back to status:todo (or status:changes), with a comment
        │
        └─ blocked ─► status:blocked, comment explaining what's needed
```

### The dispatch rule (for the scheduled wake)

The wake job's "ship" behavior acts on:

> open issues labeled `status:todo` **and not** `status:in-progress`.

On claim it atomically swaps `status:todo → status:in-progress`. Two safeguards
against double-execution:

1. The wake job is **serialized** (only one wake runs at a time; new triggers
   queue).
2. The label swap means a second wake sees no `status:todo` to claim.

Triggers: the GitHub `issue labeled` event (react the moment a human applies
`status:todo`), plus the existing schedule as a backstop sweep in case an event
is missed.

---

## Non-goals

- The implementer's *internal* design (how it produces/reviews code) — out of
  scope here.
- The exact prompt/runtime that launches the implementer — separate work item.
- Branch/CI/deploy mechanics — already in place.

---

## Decisions we want reviewed

1. **Is "To Do" the right dispatch gate**, or should "committed to a sprint" and
   "start now" be two separate labels (`status:todo` + `status:dispatch`)? *(Our
   lean: one gate — To Do — for fewer states.)*

2. **Backlog vs Ready — keep both columns, or collapse?** Backlog = unrefined,
   Ready = refined-but-not-committed. *(Our lean: keep both only if a visible
   "agreed but unscheduled" lane is valuable; otherwise drop Backlog and treat
   un-labeled issues as backlog.)*

3. **Done as a closed issue vs an explicit `status:done` label.** *(Our lean:
   closing the issue is Done; a label only adds board visibility on closed cards.)*

4. **Rejection path:** send a reviewed-but-rejected card back to `status:todo`
   (re-arm) or to a dedicated `status:changes` so a kickback reads differently
   from a fresh commit? *(Our lean: a distinct `status:changes`.)*

5. **Blocked semantics:** when the implementer blocks, should it drop
   `status:in-progress` (a clean "back to you") or keep it (still owned, just
   stalled)? *(Our lean: drop it.)*

### Also welcome

- Failure modes we've missed (races, stuck cards, label drift).
- Whether labels are the right primitive at all vs. GitHub Projects status fields,
  issue state, or a separate queue.
- Any standard kanban/agile convention we're violating.

---

## What a "yes" looks like

If the model holds up, we will: create the `status:*` labels, change the wake
trigger from its current ad-hoc form to the `status:todo` rule above, and document
the board as the standard way work flows from specification to shipped code.
