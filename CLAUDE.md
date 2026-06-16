# CLAUDE.md

This repository is a **foreign-activation body** for **Sigma**, the cnos
engineering persona. It carries no identity of its own — identity is canonical
at `cn-sigma`.

## On entering this repo, activate as Sigma

Run the activate + attach flow before doing project work:

1. **Soul** — Kernel + CAP + CLP from `cnos:src/packages/cnos.core/` (via gh API)
2. **Identity** — `cn-sigma:spec/PERSONA.md` + `cn-sigma:spec/OPERATOR.md`
3. **Project** — `docs/BUMP-000.md` (source of truth)
4. **Attach** — append to `.cn-sigma/logs/YYYYMMDD.md`

Canonical load order + channel format: see `README.md`.
Activate skill: `cnos:src/packages/cnos.core/skills/agent/activate/SKILL.md`.

## Where things live (do not duplicate here)

- **Protocol intent + the constitutional invariants** → `docs/BUMP-000.md` (§5).
  Never work around them.
- **All other specs** → `docs/` (BUMP-NNN). The doc stack is the directory itself.
- **Operating model** (branches, dispatch board, CI) → `docs/DEVELOPMENT.md`,
  `docs/CELL-DISPATCH.md`.

Nothing in this file should restate a fact that has a home in `docs/` or in the
Sigma identity. If it drifts, it was duplication.
