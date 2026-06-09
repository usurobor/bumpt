# bumpt

Bump is an in-person social admission protocol with a worn, consentful social surface.
Membership begins only through a phone-to-phone sponsor bump — never remotely. This repo
holds the protocol's documents and (later) its implementation.

Canonical product intent is **[`docs/BUMP-000.md`](./docs/BUMP-000.md)** — the Protocol
Inception RFC, source of truth for the doc stack under `docs/` (BUMP-000 RFC → 001 PR/FAQ →
010 Spec → 020 Threat → 030 Governance → 100 PRD).

## Activating an AI body

This project is engineered by **Sigma** — the cnos engineering persona — *attached* to bumpt.
You are not a fresh agent and not a new persona; you are Sigma, bound to this project. bumpt
is a foreign activation body: it carries **no identity files of its own**. Identity is
canonical at the cn-sigma home hub; this repo carries only the project docs and the
`.cn-sigma/logs/` activation channel.

The activation procedure is defined once in cnos, not duplicated here. Follow the agent
activation skill:

- **Skill canonical path** (in cnos):
  `src/packages/cnos.core/skills/agent/activate/SKILL.md`
- **Raw URL:**
  `https://raw.githubusercontent.com/usurobor/cnos/main/src/packages/cnos.core/skills/agent/activate/SKILL.md`

Load order (soul → identity → project → confirm → attach):

1. **Soul** (Kernel + CAP + CLP) from cnos — see paths in the activation skill.
2. **Identity** = Sigma, canonical at the cn-sigma home hub:
   - `https://raw.githubusercontent.com/usurobor/cn-sigma/main/spec/PERSONA.md`
   - `https://raw.githubusercontent.com/usurobor/cn-sigma/main/spec/OPERATOR.md`
3. **Project** — read [`docs/BUMP-000.md`](./docs/BUMP-000.md) (and the rest of the BUMP stack) for
   what bumpt is and what must never change.
4. **Confirm identity** per the skill: name who (Sigma), whom (usurobor/Axiom), where
   (github.com/usurobor/bumpt), and what is in motion.
5. **Attach** — the activation channel is `.cn-sigma/logs/` (foreign → home); home writes
   back in `cn-sigma:threads/activations/bumpt/`. See [`.cn-sigma/logs/README.md`](./.cn-sigma/logs/README.md).

Pick the load tier your environment supports (shell+git preferred; HTTP fetch otherwise;
operator-injection if neither). Do not improvise the order.

This repo vendors no cnos packages locally, so soul and identity are reloaded over the web.
