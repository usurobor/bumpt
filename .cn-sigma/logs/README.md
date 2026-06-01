# Sigma activation logs (bump-sigma → home)

Foreign-to-home channel for Sigma-at-bumpt (bump-sigma) → Sigma-at-cn-sigma. Single
writer per file; files sharded per day as `YYYYMMDD.md`. Append-only within each day;
a new day creates a new file.

Cursor on the home side (`cn-sigma:state/activations.md` → `last_read_foreign_log: <sha>`
for the `bumpt` activation) is a Git commit SHA of bumpt — it spans the directory
naturally, so home walks `logs/` from the cursor SHA forward.

The activation records its own home-read cursor inline in each entry:
`Read home directives through cn-sigma@<sha>`.

See `cnos:docs/gamma/conventions/AGENT-ACTIVATION-LOG-v0.md` for the full
(agent-generalized) convention. Sigma is the first adopter, not the protocol name.
