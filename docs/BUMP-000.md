# BUMP-000: Protocol Inception RFC

> Bump is an in-person social admission protocol with a worn, consentful social surface.

- **Status:** Draft v0.4
- **Owners:** TBD
- **Reviewers:** TBD
- **Last updated:** 2026-05-30
- **Document role:** Canonical inception document
- **Governing question:** What is Bump, what must never change, and what is the smallest coherent product that proves it?

---

## 1. One line

Bump lets people you meet in the room discover your current, opt-in social signal through a worn tag. Membership can only begin through an in-person sponsor bump.

---

## 2. The hard distinction

Bump is not trying to build a better feed.

Bump changes the social primitive:

| From | To |
|------|----|
| Feed | worn tag |
| Follow | encounter |
| Invite link | in-person sponsor bump |
| Profile | current signal |
| Status | non-transferable receipts |
| Platform | forkable protocol |

The product only works if these moves stay together. If admission becomes remote, Bump becomes another invite network. If standing becomes transferable, Bump becomes a status market. If visibility becomes default-public, Bump becomes surveillance jewelry. If the protocol is not forkable, Bump becomes another captured platform.

---

## 3. Problem

Real-world scenes still rely on platform tools built for remote attention markets.

A person at a show, salon, conference, campus, gym, studio, or pop-up often wants to answer simple questions:

- Who are you here as?
- What are you open to right now?
- Who can vouch for you?
- What have you actually done here?
- Can I find you later without giving you my phone number?

Existing social products answer those questions poorly because their primitives were built for remote growth, advertising, and algorithmic distribution.

| Symptom | Root cause |
|---------|-----------|
| Feeds exhaust people | Attention is the monetized resource |
| Bots and spam scale remotely | Signup has no physical or social cost |
| Status can be bought | Reputation is expressed through transferable numbers |
| IRL scenes remain fragmented | Tools optimize for online broadcast, not in-room trust |
| Communities cannot exit | Identity, history, and graph are locked to a vendor |
| "Public by default" creates risk | Visibility is treated as content distribution, not consent |

Bump starts from a narrower problem: people who share physical space need a lightweight, accountable way to present current intent and admit new members without surrendering the scene to a platform.

---

## 4. Thesis

Bump works if four claims hold:

1. **Physical admission creates social cost.**
   A member can only join through an in-person bump with an existing member. This does not prove legal identity. It proves that a sponsor took responsibility for admitting a node in physical proximity.
2. **The worn tag beats the feed for in-room discovery.**
   A scan should answer "what are you open to right now?" faster than a profile, handle, linktree, group chat, or platform search.
3. **Receipts beat scores for trust.**
   Standing should come from signed, inspectable evidence of actions, not from likes, follower counts, purchased boosts, tokens, or vibes.
4. **Forkability keeps the commons alive.**
   The protocol, schemas, and governance history must survive any single app, company, maintainer group, or cell.

If these claims hold together, Bump becomes remote-spam-resistant, socially accountable, harder to buy, useful in real-world scenes, and survivable beyond one operator.

---

## 5. Non-negotiable principles

These are constitutional. Changing one changes the product.

### 5.1 Physical admission

The only path to membership is an in-person bump accepted by an existing member — you ask, and a member accepts, in person. The v1 ceremony is specified in [BUMP-050](./BUMP-050.md).

- No invite links.
- No remote signup.
- No email-code membership.
- No "I know them online" exception.

A remote person may view public information. They may not become a member remotely.

### 5.2 Sponsor accountability

Every member has a sponsor.

A sponsor is not merely an inviter. A sponsor is the first accountable witness for a node's entry into the network. Sponsor standing can be affected by repeated downstream abuse, fraud, coercion, or spam.

Sponsor accountability must be bounded. A sponsor is accountable for admission judgment, not for controlling another adult forever.

### 5.3 Consentful visibility

Scanning a tag never grants unlimited access.

A tag may expose a public card. Every live signal is opt-in, scoped, time-bounded where appropriate, and revocable.

Default is private.

The original draft said: "Anyone can scan your tag and see what you are doing right now." That is too broad. The converged rule is:

> Anyone can scan your tag and see only what you have explicitly chosen to show to that scanner class at that moment.

### 5.4 Non-transferable standing

Standing is bound to a node and the receipts that created it.

It cannot be bought, sold, lent, merged, auctioned, rented, gifted, boosted, tokenized, or transferred to another node.

A person may recover access to their node. They may not sell the node's standing.

### 5.5 Receipts as evidence

Every consequential action produces a signed receipt.

A receipt is not automatically public. It is inspectable by the parties or governance scopes allowed to inspect it.

Claims without receipts may be conversation. They are not protocol evidence.

### 5.6 No internal currency

Bump has no token, paid boost, ad market, internal coin, or tradable reputation unit.

External money may fund external costs: tags, hosting, events, moderation labor, audits, manufacturing, and grants. Money must not buy standing.

### 5.7 Forkable commons

Protocol, schemas, client rules, governance history, and constitutional changes are public and forkable.

Private user data is not forked by default. The commons is the protocol and governance substrate, not everyone's personal history.

### 5.8 Local cells, global minimums

Cells may govern local norms. They may not violate the constitutional minimums.

A cell may add stricter rules for admission, conduct, events, missions, and visibility. It may not enable remote admission, transferable standing, paid boosts, or involuntary visibility.

---

## 6. Product boundary

Bump has four core surfaces.

1. **Tag** — The worn physical interface.
2. **Bump** — The in-person admission ceremony.
3. **Signal** — The current, consentful social emission.
4. **Receipt** — The evidence layer for membership, conduct, standing, and governance.

Everything else is secondary.

Cells, missions, delegation, discovery, events, leaderboards, maps, and richer profiles may exist later, but they must compose from the four core surfaces. They are not allowed to become new product centers unless the protocol proves they are missing primitives.

---

## 7. Primitives

The system is built from durable nouns. Add a primitive only when no composition of existing primitives works.

| Primitive | Definition | MVP? |
|-----------|-----------|------|
| Node | A member identity with keys, sponsor lineage, receipts, and standing. | Yes |
| Tag | A worn physical object with QR and/or NFC pointer to a node-controlled surface. | Yes |
| Signal | A live, scoped, revocable emission from a node. | Yes |
| Bump | A proximity-gated sponsor ceremony that can admit a new node or bind a tag. | Yes |
| Capability | A scoped permission to perform one action under named constraints. | Yes |
| Receipt | A signed record of a witnessed event or consequential action. | Yes |
| Standing | Non-transferable reputation derived from receipts across named vectors. | Partial |
| Cell | A local group that self-governs under constitutional minimums. | Later |
| Mission | A bounded task with required evidence and witnesses. | Later |
| Delegation | A scoped, time-bounded loan of a capability, never of reputation. | Later |

**Naming adjustment.** The draft's "Bump capability" should become either **Admission capability** or **Bump pass**. Recommendation: *Admission capability* in the protocol spec and *Bump pass* in product copy.

---

## 8. Primary users

Bump has five user roles.

### 8.1 Member

A person with a node, tag, sponsor, keys, and receipts.

The member's core job:

> "When I am in a real-world scene, I want to show the right amount of current context so the right people can approach me without making my whole life public."

### 8.2 Scanner

A person who scans a tag.

They may be a member or non-member. They see only what the member has exposed to their scanner class.

The scanner's core job:

> "When I meet someone in the room, I want to understand who they are here as and whether interaction is welcome."

### 8.3 Sponsor

A member who admits another member through an in-person bump.

The sponsor's core job:

> "When I bring someone into the network, I want the system to record that I witnessed and accepted responsibility for their entry."

### 8.4 Cell steward

A member trusted to help govern a local cell.

The steward's core job:

> "When a scene grows, I want local rules and receipts that let us govern conduct without depending on a platform's opaque moderation."

### 8.5 Protocol maintainer

A person or group maintaining schemas, clients, governance history, or reference implementations.

The maintainer's core job:

> "When the network changes, I want protocol evolution to be inspectable, forkable, and constrained by constitutional rules."

---

## 9. Core flows

### 9.1 Scan a tag

A scanner taps or scans a member's tag.

The scanner sees a node card containing only the member's currently exposed fields.

Minimum node card:

- Display name or handle
- Current signal, if exposed
- Membership status, if exposed
- Sponsor/cell proof, if exposed
- Safe interaction affordance
- Report/block affordance

A scan does not imply friendship, follow, contact exchange, location sharing, or access to private receipts.

### 9.2 Publish a signal

A member creates a signal.

A signal answers:

- What am I open to right now?
- Who may see it?
- How long should it last?
- Can it be reshared?
- What should happen when it expires?

Example signals:

- Open to talk about: hardware, ambient computing, mutual aid
- Here for: dancing, not networking
- Looking for: drummer for Thursday session
- Hosting: afterparty list, friends-of-friends only
- Do not approach: quiet mode

Signals must be easy to revoke.

### 9.3 Join by bump

A prospective member and sponsor meet in person.

The sponsor opens admission mode. The prospective member opens join mode. The phones exchange a short-range challenge through NFC, BLE, local network, ultrasonic, QR challenge, or another proximity method. The ceremony produces an admission receipt.

The v1 realization of this ceremony — *ask to bump → accept in person → receipt* — is specified in [BUMP-050](./BUMP-050.md).

Minimum admission receipt:

- `new_node_id`
- `sponsor_node_id`
- `timestamp`
- `proximity_method`
- `challenge_hash`
- `ruleset_version`
- `cell_id` (optional)
- `sponsor_signature`
- `new_member_signature`

The receipt proves protocol admission. It does not prove legal identity.

### 9.4 Bind a tag

A member binds a physical tag to their node.

The binding receipt records that a tag pointer currently resolves to a node-controlled surface. Tags must be replaceable. A lost tag must be revocable. A stolen tag must not grant account control.

### 9.5 Revoke a signal

A member revokes a signal.

Revocation must propagate to the canonical node surface immediately. Receipts may preserve that a signal existed, but the content visibility rules after revocation must remain enforceable.

### 9.6 Report harm

A member or scanner reports conduct.

Reports should produce receipts, but privacy and retaliation risk must shape disclosure. Not every safety receipt should be broadly visible.

The system needs separate concepts for:

- private safety report
- cell-level moderation receipt
- public governance action
- standing adjustment
- appeal

### 9.7 Recover a node

A member loses a phone or key.

Recovery must preserve the non-transferability invariant. Recovery is not a sale, merge, or reputation transfer.

Possible recovery model:

- primary key
- recovery key
- sponsor-assisted recovery
- cell-steward quorum recovery
- cooldown period
- public recovery receipt
- old key revocation

Recovery requires its own threat model before launch.

### 9.8 Exit

A member can leave.

Exit must support:

- hide public card
- revoke active signals
- detach tag
- export receipts the member controls
- preserve necessary governance receipts
- mark node inactive

Exit does not erase all receipts from other parties' histories, but it must minimize unnecessary exposure.

### 9.9 Fork

A group can fork the protocol or a cell.

Forkability applies to:

- schemas
- rules
- governance history
- reference clients
- public cell history

Forkability does not automatically export private user data, private reports, or private receipts.

---

## 10. Standing

Standing is not a global score.

Standing is a set of named vectors derived from receipts.

Possible vectors:

- Admission judgment
- Reliability
- Contribution
- Witness quality
- Safety record
- Stewardship
- Mission completion

Standing must be:

- non-transferable
- receipt-derived
- scope-aware
- appealable where governance action is involved
- resistant to purchase
- resistant to brigading
- explainable to the affected member

A strong rule:

> No standing vector may be computed from a signal that was not intended to create standing.

For example, someone's "open to chat" signal should not become a popularity metric.

---

## 11. Cells

A cell is a local governance unit.

Examples:

- a venue
- a recurring salon
- a campus scene
- an art collective
- a conference cohort
- a mutual-aid group
- a city chapter

A cell may define:

- local admission norms
- event rules
- steward roles
- report handling
- mission types
- cell-specific standing vectors
- visibility defaults stricter than the global default

A cell may not define:

- remote membership
- transferable standing
- paid boosts
- forced public visibility
- private data forks
- rules that bypass constitutional minimums

Cells are not required for MVP, but the MVP should avoid choices that make cells impossible later.

---

## 12. Missions

A mission is a bounded task with evidence.

Examples:

- work the door for one event
- document a show
- clean up a venue after closing
- bring three verified first-timers to orientation
- mentor a new member for 30 days
- run soundcheck
- deliver supplies

Mission receipts may affect standing.

A valid mission defines:

- task
- cell
- time window
- required evidence
- required witnesses
- success condition
- standing effect
- appeal path, if disputed

Missions are later-phase. They should not be in the first MVP unless the first community already runs on task-based contribution.

---

## 13. MVP

The MVP should prove the protocol kernel, not the whole society.

### 13.1 MVP claim

Bump MVP proves that:

> In a real-world scene, a worn tag plus in-person sponsor bump creates a more useful and accountable social surface than exchanging handles, phone numbers, QR menus, or joining a group chat.

### 13.2 MVP scope

Build only:

- Node
- Tag
- Public/private node card
- Current signal
- In-person sponsor bump
- Admission receipt
- Tag binding and revocation
- Basic sponsor lineage
- Basic report/block
- Manual steward console
- Exportable receipt log

Do not build yet:

- global discovery feed
- algorithmic recommendations
- marketplace
- token
- paid boosts
- remote invite links
- missions
- delegation
- multi-cell governance automation
- complex standing scores
- public sponsor tree for everyone

### 13.3 MVP success criteria

The MVP succeeds if, in one bounded scene:

- 100–300 members join only by in-person bump
- \>70% of members bind and wear a tag at least once
- \>50% publish or update a signal during an event
- scanners understand the node card without explanation
- new members can explain who sponsored them
- stewards can resolve basic abuse/report cases
- lost tag and lost phone recovery are handled without standing transfer
- no remote invite workaround becomes socially necessary

### 13.4 MVP failure criteria

The MVP fails if:

- people mostly use it as a linktree
- members ask for remote invite links
- signals feel unsafe to publish
- sponsors do not understand accountability
- stewards cannot inspect receipts
- tag scans reveal too much by default
- membership becomes status flex rather than scene utility

---

## 14. Threat model

Bump must not launch without a threat model.

Minimum threats:

| Threat | Risk | Required mitigation |
|--------|------|---------------------|
| Remote relay attack | Someone simulates physical bump remotely | Short-lived challenge, proximity method, device checks, sponsor warning |
| Sponsor farming | Members admit strangers for clout | Sponsor standing, rate limits, cell review |
| Tag theft | Stolen tag impersonates member | Tag revocation, no account control from tag alone |
| Stalking | Tag scan reveals too much | Default private, scoped signals, quiet mode, scanner classes |
| Coercive scanning | Someone pressures a member to reveal signal | Fast privacy controls, safe blank state |
| Doxxing via receipts | Evidence exposes private history | Selective disclosure, private receipts, governance scopes |
| Standing marketplace | People buy reputable nodes | Recovery controls, non-transfer rule, anomaly review |
| Governance capture | One operator changes rules | Public governance history, fork rights, constitutional constraints |
| False reports | Safety system weaponized | Evidence tiers, appeals, steward review |
| Lost phone | Member loses node access | Recovery protocol without standing transfer |
| Minor safety | Youth or age-sensitive settings | Cell-level policies, privacy defaults, possible age-gated deployments |
| Venue misuse | Door staff use Bump as surveillance | Clear scanner limits, no involuntary attendance tracking |

The key wording change: Bump is **not un-spammable**. It is **remote-spam-resistant** by increasing social, physical, and sponsor costs. Do not overclaim.

---

## 15. Protocol architecture

Bump should separate policy from implementation.

### 15.1 Stable policy

The stable layer owns:

- membership rules
- receipt semantics
- standing non-transferability
- visibility constraints
- sponsor accountability
- forkability requirements
- schema versioning
- governance minimums

### 15.2 Volatile implementation

The volatile layer may change:

- NFC vs BLE vs QR challenge
- mobile app vs web app
- key storage method
- tag manufacturer
- hosting model
- cell UI
- steward tooling
- receipt storage backend

This separation matters. If NFC fails in practice, Bump should not fail as a protocol. If one app dies, nodes and receipts should remain portable.

### 15.3 Minimal schema set

The first protocol spec should define:

- Node
- TagBinding
- Signal
- AdmissionReceipt
- SignalReceipt
- TagReceipt
- ReportReceipt
- StandingVector
- CellRuleset
- GovernanceChange

Do not define missions, delegation, or complex standing until the MVP creates real pressure.

---

## 16. Governance

Bump governance has three levels.

### 16.1 Constitutional governance

Changes to non-negotiable principles require constitutional process.

Examples:

- physical admission
- non-transferable standing
- consentful visibility
- no internal currency
- forkable commons
- receipt evidence

These should be hard to change.

### 16.2 Protocol governance

Protocol governance changes schemas, receipt semantics, client requirements, and interoperability rules.

These changes need:

- proposal
- rationale
- migration path
- compatibility story
- threat-model update
- public decision receipt

### 16.3 Cell governance

Cell governance handles local rules, stewards, reports, events, and local standing.

Cells may evolve faster than the protocol, but they cannot violate constitutional rules.

---

## 17. Open questions

These should remain open until evidence exists.

### 17.1 Admission proximity

Which proximity method is good enough for v1?

Candidates:

- NFC tap
- BLE challenge
- rotating QR challenge
- local network challenge
- multi-method fallback

Decision criterion:

- hard enough to fake remotely
- fast enough in a loud venue
- works on common phones
- produces inspectable receipt
- does not require invasive permissions

> Proposed resolution: [BUMP-050](./BUMP-050.md) specifies a **rotating-QR request/accept**
> ceremony as the v1 transport, with `proximity_claim: "sponsor_attested"` (an accountable
> member accepts in person). NFC/BLE/UWB remain available as later hardening. Constitutional
> ratification of this resolution is pending.

### 17.2 Public sponsor lineage

How much sponsor lineage should be visible?

Too little visibility weakens accountability. Too much creates social graph surveillance.

Likely answer:

- member can see own sponsor path
- stewards can inspect relevant lineage under rules
- public viewers see limited membership proof
- full lineage is not public by default

### 17.3 Standing vectors

Which standing vectors should exist first?

Likely answer:

- admission judgment
- reliability
- steward action history

Avoid broad "reputation" until the network has enough receipts to justify it.

### 17.4 Fork portability

What does a member carry across forks?

Possible portable set:

- node keys
- self-controlled receipts
- tag history
- public standing proofs
- cell-specific receipts only if exportable under that cell's rules

### 17.5 Moderation privacy

How can safety receipts be inspectable without making victims or reporters permanently exposed?

This needs a dedicated safety design.

---

## 18. First PR/FAQ seed

This belongs in BUMP-001, but the inception RFC should carry a seed.

**Press release headline**

> Bump launches a wearable social protocol for real-world scenes

**Subhead**

> Members wear a tag that shows only what they choose to share right now. New members can join only through an in-person sponsor bump.

**Customer quote**

> "I didn't want another profile to maintain. I wanted people in the room to know what I was open to, and I wanted the scene to stay accountable to itself."

**External FAQ**

*Is Bump another social network?*
No. Bump has no feed, no follower count, no ads, no paid boosts, and no remote invite links. It is a protocol for in-person membership and consentful real-world discovery.

*Can anyone scan my tag?*
Yes, but a scan only reveals what you have chosen to expose. Default is private.

*Can I join without meeting someone?*
No. Membership starts with an in-person sponsor bump.

*Does Bump verify my legal identity?*
No. Bump verifies membership admission, sponsor lineage, and receipts. It is not a government identity system.

*Can I buy status?*
No. Standing is non-transferable and receipt-derived.

*What happens if Bump the company dies?*
The protocol, schemas, and governance history are forkable. A compatible client or cell can continue.

---

## 19. Strongest current sentence

Keep this:

> Move the social object from the feed to the worn tag.

That is the sharpest product insight in the draft.

---

## 20. Most important correction

Replace this:

> Anyone can scan your tag and see what you are doing right now.

With this:

> Anyone can scan your tag and see only the current signal you chose to expose to that scanner class.

That one sentence protects the whole product from becoming ambient social surveillance.

---

## 21. Converged positioning

Use this as the top-level positioning:

> Bump is a forkable social protocol for real-world scenes. Members wear tags that reveal consentful, current signals. New members join only through an in-person sponsor bump. Standing comes from non-transferable receipts, not followers, tokens, or paid reach.

That is the product.
