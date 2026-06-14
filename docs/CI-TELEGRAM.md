# CI → Telegram notifications (cnos standard practice)

Standard notification practice for cnos projects of this type. The gated
`dev → deploy` pipeline (see [`DEVELOPMENT.md`](./DEVELOPMENT.md)) posts to a
Telegram channel at two points, both `if: always()` so failures are never silent:

- **Pre-deploy** — after the CI gate, on every push to `dev`.
- **Post-deploy** — after the promotion/release job. Skipped automatically when
  the gate failed and the deploy never ran.

The rule: **green is short, red is detailed.**

- *Green* — you only want to know the gate cleared: headline + one-line aggregate.
- *Red* — you need to triage from your phone: a per-check breakdown, aggregate at
  the bottom for orientation. Click through to the run only if needed.

The two notifications share one shape so the reader never context-switches.

> Reference implementation lives on bumpt's `dev` branch:
> `.github/workflows/ci-deploy.yml` (the `notify-pre` / `notify-post` jobs) and
> `experiment/.ci/telegram-notify.sh` (the shared message assembler, so the two
> notifications can't drift).

## Message shapes

Layout (blocks joined by a blank line; empty blocks dropped):

```
<header>
<subline>

<breakdown>      ← red pre-deploy only
<aggregate>      ← pre-deploy only

<commit subject>
<run link>
```

### Pre-deploy — passed

```
✅ Pre-deploy passed
<project>@dev:abc1234

smoke · 7/7 checks passed

<commit subject>
https://github.com/<owner>/<project>/actions/runs/<run_id>
```

### Pre-deploy — failed

```
❌ Pre-deploy failed
<project>@dev:abc1234

  ✅ typecheck
  ✅ build
  ❌ smoke (5/7)
  ⏭ db-verify

smoke · 5/7 checks passed

<commit subject>
https://github.com/<owner>/<project>/actions/runs/<run_id>
```

The breakdown is per **gate check**, in run order. Each icon is that check's
`outcome`: ✅ success · ❌ failure · 🚫 cancelled · ⏭ skipped · ❓ other. Checks
run sequentially, so a failure shows the failed check plus ⏭ for everything that
didn't get to run. The test row carries a `(passed/ran)` suffix (and
`, N skipped` when non-zero), parsed from a Playwright-shaped `stats.json`
(`expected` = passed, `unexpected` = failed, `skipped` = `test.skip()`d;
`ran = expected + unexpected`).

> Where a project shards tests into a per-spec matrix, the breakdown is one row
> per spec. Where the gate is a single sequential job (as in bumpt today), it is
> one row per check. Same contract either way.

### Post-deploy — success / failed

```
✅ Post-deploy success
<project>@deploy-20260614.204118:abc1234 → <prod_url>

<commit subject>
https://github.com/<owner>/<project>/actions/runs/<run_id>
```

The headline swaps on result (`✅` success · `❌` failed · 🚫 cancelled · ❓ other).
The subline uses the release tag and, when a `PROD_URL` repo variable is set,
appends `→ <prod_url>` so the reader sees the target surface without a click.

bumpt's post-deploy is **notify-only** today (it confirms the release was cut and
pushed to `deploy`, which Vercel then builds) — there is no live-site aggregate
yet. To make post-deploy as detailed as pre-deploy, add a post-deploy job that
runs the smoke test against `PROD_URL` and gate the message on its result. When
the live target differs structurally from the gate's (e.g. more tests skip on the
production host), suffix the skip count with `on live` so the reader knows the
delta is structural, not a regression.

## One-time setup

Notifications **no-op cleanly** until both secrets exist, so the workflow stays
green for forks/PRs and before setup. To turn them on:

1. **Create a bot.** In Telegram, message [@BotFather](https://t.me/BotFather),
   send `/newbot`, follow the prompts. It returns a token like
   `123456789:AAExampleTokenString` → `TELEGRAM_BOT_TOKEN`.

2. **Pick the destination and get its chat id.**
   - **Channel:** create one, add the bot as an **admin** so it can post. The id
     looks like `-1001234567890`.
   - **Group:** add the bot to the group; the id is negative, e.g. `-1234567890`.
   - **Direct message:** message the bot; your id is a positive number.

   To read the id: send a message in the destination, open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser, and read
   `result[].chat.id`. That value is `TELEGRAM_CHAT_ID`.

3. **Add the repo secrets.** GitHub → **Settings → Secrets and variables →
   Actions → New repository secret**:
   - `TELEGRAM_BOT_TOKEN` = the BotFather token
   - `TELEGRAM_CHAT_ID` = the destination id
   - *(optional, Variables tab)* `PROD_URL` = the live URL

4. **Verify.** Push any commit to `dev`; you should get a ✅/❌ Pre-deploy
   message, then a Post-deploy message if the gate passes.

To send elsewhere later, just change `TELEGRAM_CHAT_ID`.
