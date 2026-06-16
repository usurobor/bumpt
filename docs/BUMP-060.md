# BUMP-060: Node Control and Recovery

> Members control nodes with passkeys. Email is optional contact metadata — never the identity, never enough to recover or transfer standing.

**Status:** Draft v0.1
**Document role:** Protocol spec — authentication, node control, recovery
**Authority:** BUMP-000 (§5.1 physical admission, §5.4 non-transferable standing, §9.7 recovery) · admission in [BUMP-050](./BUMP-050.md)
**Governing question:** How does a member prove control of their node without making email the identity primitive?

> The policy in one line: **membership is created by in-person acceptance; node control is proven by a passkey; email is optional contact metadata.**

---

## 1. Node identity vs login credential

Bump's product identity is the **node**. Login proves *control of the node* — it does not define the node. Separate four things and never collapse them:

| Thing | What it is |
|---|---|
| **Node** | the member's Bump identity (`node_id`), created only by in-person acceptance (BUMP-050) |
| **Credential** | a way to prove control of the node — normally a passkey |
| **Profile** | the editable public/member card fields |
| **Contact method** | optional email/phone/etc. — not required for membership |

Do **not** model `email = member identity`. Model:

```
node_id  = member identity
passkey  = control of node
email    = optional contact channel
```

A passkey is a **node-control credential, not the node itself** (see §10 / protocol nuance).

## 2. Passkey-first authentication

Login uses passkeys / WebAuthn — public-key authentication, phishing-resistant, no password database to steal, credentials scoped to the `bumpt.io` relying-party origin. That maps exactly to "this device can control this node."

Email magic-link login is rejected for core identity: it feels like remote SaaS signup, is personal/contact data, can be forwarded, makes email compromise into node compromise, and makes the network feel like a waitlist. Passkey login instead means *this device controls this node* — closer to the protocol.

## 3. No remote account creation

There is no "Create account" page. A node is created **only** when a member accepts a newcomer in person (BUMP-050). During acceptance, the new member creates their first passkey:

> You're in. Create your Bump key to control your card. **[Create passkey]**

The app registers a WebAuthn credential bound to the new `node_id`. No email, no password, no remote account creation.

Login surface keeps the locked door intact:

> **Member login** — [Continue with passkey]
> Not a member? Scan a member and ask to bump.

## 4. Profile edit authorization

Members edit through an authenticated view; the public card stays read-only.

- `/m/<node>` — read-only public/member card
- `/me`, `/me/card` — authenticated edit view (login via passkey → session bound to `node_id`)

Authorization is **server-side**, never just a hidden button: the edit endpoint must enforce `session.node_id == profile.node_id`.

Editable fields, kept small (Bump is not a profile network): display name, bump name / handle, photo or avatar, current card text, visibility setting, active tag bindings.

## 5. Optional contact methods

Email exists only as optional metadata.

**Good uses:** shirt-order receipt, shipping updates, recovery *notifications*, security alerts, optional product updates, support contact.

**Forbidden uses:** remote signup; primary member identity; sponsor bypass; profile ownership by mailbox; membership recovery by email alone.

Email and cookie identifiers can be personal/identifying data depending on context (cf. ICO online-identifier guidance). If Bump can avoid collecting email for core membership, it should.

## 6. Lost device recovery

Passkey-first auth's main cost is recovery. There must be a recovery story before real membership. Use layers, strongest first:

1. **Second passkey** — register more than one device (phone + laptop, or phone + hardware key).
2. **Recovery code** — a one-time backup code shown once at enrollment.
3. **Sponsor/steward-assisted recovery** — see §7.

## 7. Sponsor/steward-assisted recovery

When a member has lost all credentials:

1. The new device requests recovery.
2. A **sponsor or steward confirms the member in person**.
3. A **cooldown** period applies.
4. The old credential is **revoked**.
5. A **recovery receipt** is created.

Email may *notify* the member that recovery was requested, but email must **never** recover the node by itself.

> **Recover node?** This will move control of your Bump node to a new device. A sponsor or steward must confirm you in person. The old key will be revoked after a cooldown.

Recovery moves *control*; it never transfers *standing* (BUMP-000 §5.4 / §9.7).

## 8. Credential revocation

Credentials are independently revocable (`revoked_at`). Adding, listing, and revoking credentials is a node-owner action; revocation and recovery both emit receipts (§9). A revoked credential can no longer open a session.

## 9. Receipt requirements

Consequential node-control actions produce signed, inspectable receipts (BUMP-000 §5.5): credential enrollment beyond the first, recovery, and revocation. Receipts are the protocol evidence; the passkey is control, the node is identity, **receipts are the proof**.

## 10. Minimal schema

```sql
nodes (
  id              text primary key,
  sponsor_node_id text,
  created_at      timestamptz not null,
  status          text not null
);

node_credentials (
  id            uuid primary key,
  node_id       text not null references nodes(id),
  type          text not null,          -- passkey | security_key | recovery
  credential_id text not null unique,
  public_key    text not null,
  created_at    timestamptz not null,
  last_used_at  timestamptz,
  revoked_at    timestamptz
);

node_profiles (
  node_id      text primary key references nodes(id),
  display_name text,
  bump_name    text,
  card_text    text,
  avatar_url   text,
  visibility   text not null default 'public_card',
  updated_at   timestamptz not null
);

sessions (
  id         uuid primary key,
  node_id    text not null references nodes(id),
  created_at timestamptz not null,
  expires_at timestamptz not null,
  revoked_at timestamptz
);
```

Later: `recovery_requests`, `recovery_receipts`, `contact_methods`, `profile_change_receipts`.

## 11. What not to build

- password login
- email-only magic-link login
- "Sign in with Google/Apple" **as Bump identity** (OS/password-manager passkey *storage* via Google/Apple is fine — that's a different thing)
- remote account creation
- reset-by-email as the sole recovery
- profile editing before an accepted bump

## 12. Open questions

- Cooldown duration and steward authority bounds for §7 recovery.
- Whether recovery requires one sponsor/steward or a quorum.
- Portable node keys / exportable receipt proofs for the longer-term forkable protocol — WebAuthn credentials are scoped to the `bumpt.io` origin, so cross-implementation portability may need a separate key or receipt-proof mechanism beyond v1.
- Session lifetime and re-auth policy for sensitive actions (credential/recovery changes).

---

**Policy (final):** Bump does not use email to create membership, and does not use email as the node identity. Members control nodes with passkeys. Email is optional contact metadata and is never enough to recover or transfer standing.
