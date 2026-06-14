# CI → Telegram notifications

The `CI & gated deploy` workflow posts to a Telegram channel at two points, both
`if: always()` so failures are never silent:

- **Pre-deploy** — after the `build-test` gate, on every push to `dev`.
- **Post-deploy** — after the `deploy` job (fast-forward `deploy` + tag + release).
  Skipped automatically when the gate failed and `deploy` never ran.

The rule (borrowed from bb-shop): **green is short, red is detailed.**

## Message shapes

Both messages share one layout, assembled by `experiment/.ci/telegram-notify.sh`:

```
<header>
<subline>

<breakdown>      ← red pre-deploy only
<aggregate>      ← pre-deploy only (smoke counts)

<commit subject>
<run link>
```

### Pre-deploy — passed

```
✅ Pre-deploy passed
bumpt@dev:abc1234

smoke · 7/7 checks passed

<commit subject>
https://github.com/usurobor/bumpt/actions/runs/<run_id>
```

### Pre-deploy — failed

```
❌ Pre-deploy failed
bumpt@dev:abc1234

  ✅ typecheck
  ✅ build
  ❌ smoke (5/7)
  ⏭ db-verify

smoke · 5/7 checks passed

<commit subject>
https://github.com/usurobor/bumpt/actions/runs/<run_id>
```

The breakdown is per **gate step**, in run order. Each icon is the step's
`outcome`: ✅ success · ❌ failure · 🚫 cancelled · ⏭ skipped · ❓ other. Steps
run sequentially, so a failure shows the failed step plus ⏭ for everything that
didn't get to run. The smoke row carries a `(passed/ran)` suffix (and
`, N skipped` when non-zero) parsed from `smoke-stats.json`.

> bumpt's gate is a single sequential job, not a per-spec matrix like bb-shop, so
> the breakdown is per-step rather than per-spec. The aggregate counts come from
> the smoke test's check tally (Playwright-shaped: `expected`/`unexpected`/`skipped`).

### Post-deploy — success / failed

```
✅ Post-deploy success
bumpt@deploy-20260614.204118:abc1234

<commit subject>
https://github.com/usurobor/bumpt/actions/runs/<run_id>
```

Notify-only today: it reports that the release was cut and pushed to `deploy`
(which Vercel then builds). There is no aggregate because there is no live-site
test yet. The subline uses the `deploy-*` tag created by the run.

- Add a repo **variable** `PROD_URL` (e.g. `bumpt.vercel.app`) and the subline
  becomes `…:abc1234 → bumpt.vercel.app`.
- To make post-deploy as detailed as bb-shop (test the live site, report an
  aggregate), the follow-up is a post-deploy job that runs the smoke test against
  `PROD_URL` and gates this message on its result — do this once Vercel is wired.

## One-time setup

Notifications **no-op cleanly** until both secrets exist, so the workflow stays
green meanwhile. To turn them on:

1. **Create a bot.** In Telegram, message [@BotFather](https://t.me/BotFather),
   send `/newbot`, follow the prompts. It returns a token like
   `123456789:AAExampleTokenString`. That's `TELEGRAM_BOT_TOKEN`.

2. **Pick the destination and get its chat id.**
   - **Channel:** create one, add the bot as an **admin** (so it can post). The
     id looks like `-1001234567890`.
   - **Group:** add the bot to the group. The id is negative, e.g. `-1234567890`.
   - **Direct message:** start a chat with the bot and send it any message; your
     id is a positive number.

   Easiest way to read the id: send a message in the destination, then open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and read
   `result[].chat.id` (for channels, forward a channel post to
   [@userinfobot](https://t.me/userinfobot), or use `@username` as the chat id).
   That value is `TELEGRAM_CHAT_ID`.

3. **Add the repo secrets.** GitHub → repo **Settings → Secrets and variables →
   Actions → New repository secret**:
   - `TELEGRAM_BOT_TOKEN` = the BotFather token
   - `TELEGRAM_CHAT_ID` = the destination id
   - *(optional)* under the **Variables** tab: `PROD_URL` = the live URL

4. **Verify.** Push any commit to `dev`; you should get a ✅/❌ Pre-deploy
   message, and a Post-deploy message if the gate passes.

To send to a different channel later, just change `TELEGRAM_CHAT_ID`.
