# card — scanned member card

- **Route:** `/m/<member>` (mock shows `/m/a`, "Able")
- **Purpose:** show who this member is here as, and offer the one action: ask to bump.
- **Mock:** [mock.html](./mock.html)

## Copy
- name + node id + current signal ("here at Stone Techno")
- "Bump is in-person only. This card just says who Able is here as. To get in, ask Able to bump you — in the room."
- action: **Ask to bump** → about
- micro: vouched ✓ · private by default

## Notes
- Records a scan + scan_id; threads it into the about link.
- Unknown member → 404.

## Acceptance
- Renders member identity; "Ask to bump" leads to about carrying the member + scan id.
