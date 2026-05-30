# Operator — usurobor (bumpt project gates)

Version: 2.0.0

Changelog:
- v2.0.0 — reframe as a thin project-local gate layer over Sigma's canonical operator
  contract at cn-sigma; stop duplicating the contract. Breaking: prior standalone form retired.

**Pattern:** The operator is usurobor (also: Axiom). The durable operator contract lives at
cn-sigma; this file adds only the gates specific to the bumpt project.
**Relation:** Operator instruction outranks the Kernel tie-break. Where cn-sigma's contract
and this file both speak, this file's bumpt-specific gates apply on top.
**Exit:** Durable operator preferences change at cn-sigma. Only project-local gates change here.

---

## Operator — reload contract from source

- **Name:** usurobor (called Axiom by agents — creator of cnos and the coherence framework).
- **Durable contract (reload at activation):**
  `https://raw.githubusercontent.com/usurobor/cn-sigma/main/spec/OPERATOR.md`
- **What matters:** speed, accuracy, proactivity, brevity — all four at once. Direct tone,
  concise/terse, milestone updates not narration, direct correction. (Restated minimally;
  the source is canonical.)

The autonomy boundaries, UIE-before-action gate, skill-loading gate, CDD role assignment
(Sigma is δ), and Coherence-Team contract all come from the cn-sigma contract. Not repeated here.

## bumpt project-local gates

These are the gates specific to working in this repo. They sit on top of the cn-sigma contract.

### Git and external action

- **Develop on** `claude/bump-protocol-inception-bPDla`. Create locally if missing. Never
  push to a different branch without explicit permission.
- **Push** with `git push -u origin <branch>`; retry network failures with backoff (2/4/8/16s).
- **Do not open a pull request** unless the operator explicitly asks.
- **GitHub MCP scope is `usurobor/bumpt` only.** cnos and cn-sigma are reachable read-only
  over the web (tier b) for soul/identity reload; never write to them from this session.
- **Be frugal on GitHub** — comment only when genuinely necessary.
- External / hard-to-reverse / outward-facing actions: confirm first unless durably authorized.

### Product-invariant refusals (binding)

Refuse — and name what would unblock — any work that breaks a bumpt product invariant
(see `spec/PROJECT.md` → Invariants). Specifically: any remote-admission path, any QR-based
admission, any monetization surface on Node Pages, any non-consentful default visibility, any
standing transfer, any new primitive without a demonstrated composition failure, and any
overclaim (a reviewer already caught "un-spammable"; zero recurrence). Refusal is not stalling.

### Model-identity rule

The configured model identifier stays in chat replies only — never in commits, PR text, code
comments, or any artifact pushed to the repo.
