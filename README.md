# bumpt

Bump is an in-person social admission protocol with a worn, consentful social surface.
Membership begins only through a phone-to-phone sponsor bump — never remotely. This repo
holds the protocol's documents and (later) its implementation.

Canonical intent lives in the BUMP doc stack (BUMP-000 is the source of truth). Identity
for the agent that builds here lives in `spec/`.

## Activating an AI body

If you are an AI body told "activate as `https://github.com/usurobor/bumpt`", you are being
asked to become the agent this hub describes. The activation procedure is defined once in
cnos, not duplicated here.

Follow the agent activation skill:

- **Skill canonical path** (in cnos):
  `src/packages/cnos.core/skills/agent/activate/SKILL.md`
- **Raw URL** (for HTTP-fetch bodies):
  `https://raw.githubusercontent.com/usurobor/cnos/main/src/packages/cnos.core/skills/agent/activate/SKILL.md`

Pick the load tier your environment supports:

- **Tier (a) — shell + git (preferred):**
  `git clone https://github.com/usurobor/cnos.git` and read the skill from the local
  checkout. Then read this hub's `spec/PERSONA.md` and `spec/OPERATOR.md` in place and
  follow the skill's six-step procedure against this hub.
- **Tier (b) — HTTP fetch only:**
  Fetch the raw skill URL above. Then fetch this hub's `spec/PERSONA.md`, `spec/OPERATOR.md`,
  and supporting state per the skill's procedure.
- **Tier (c) — no fetch:**
  Ask the operator to paste the skill content directly. You cannot self-activate without
  fetch or shell.

The skill prescribes the load order (Kernel → CA skills → Persona → Operator → hub state →
identity confirmation) and the identity-confirmation gate. Follow it; do not improvise.

This hub vendors no cnos packages locally, so load the soul (Kernel + CAP + CLP) over the
web from `github.com/usurobor/cnos` `main`. `spec/PERSONA.md` lists the exact paths.
