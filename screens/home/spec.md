<!-- required-components: logo, wordmark, headline, rule -->
# home — locked door

- **Route:** `/`
- **Purpose:** state the rule; make clear there is nothing to sign up for.
- **View:** [view.html](./view.html) — the desired look (static mock).
- **Type:** static (no live data bindings).

## Components

Named parts of the screen. Each is tagged in the view with `data-component="<name>"`.
Required components **must render** (non-zero box) in both the mock and prod — this is
machine-checked.

| component  | shows | source | required |
|------------|-------|--------|----------|
| `logo`     | the bump mark, **visibly** | static asset | **yes** |
| `wordmark` | "bump" | static | **yes** |
| `headline` | "you can't / join online." | static | **yes** |
| `lede`     | "A worn tag. An in-person bump…" | static | no |
| `rule`     | the membership rule paragraph | static | **yes** |
| `footer`   | private/feed/accounts line + protocol/privacy links | static | no |

## Behavior

- `protocol` / `privacy` links → navigate to those pages.
- **No call to action** — no "ask to bump" here (that lives only in the scanned flow).

## Acceptance

- Every **required** component renders (non-zero box). *(Catches a missing logo.)*
- The rule text is present; no signup/CTA element anywhere on the page.
- Prod render pixel-matches `view.html` (≤ 1%).
