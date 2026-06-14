#!/usr/bin/env bash
# Send a CI status message to Telegram, assembled from TG_* env vars so the
# pre-deploy and post-deploy notifications share one shape and never drift.
#
# Inputs (env):
#   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  - credentials; if either is empty the
#                                           script no-ops (keeps forks/PRs green).
#   TELEGRAM_TOPIC_ID                      - optional; message_thread_id for a
#                                           forum/topic group (omit for a normal
#                                           chat/channel or the General topic).
#   TG_HEADER    - line 1, e.g. "✅ Pre-deploy passed"   (required)
#   TG_SUBLINE   - line 2, e.g. "bumpt@dev:abc1234"      (required)
#   TG_BREAKDOWN - optional multi-line block (red only)
#   TG_AGGREGATE - optional one-line aggregate, e.g. "smoke · 7/7 checks passed"
#   TG_SUBJECT   - commit subject line
#   TG_URL       - link to the workflow run
#
# Layout (blocks joined by a blank line; empty blocks dropped):
#   <header>
#   <subline>
#
#   <breakdown>          (red only)
#
#   <aggregate>
#
#   <subject>
#   <url>
set -euo pipefail

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" || -z "${TELEGRAM_CHAT_ID:-}" ]]; then
  echo "telegram: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping notification"
  exit 0
fi

blocks=()
blocks+=("${TG_HEADER:-}"$'\n'"${TG_SUBLINE:-}")
[[ -n "${TG_BREAKDOWN:-}" ]] && blocks+=("${TG_BREAKDOWN}")
[[ -n "${TG_AGGREGATE:-}" ]] && blocks+=("${TG_AGGREGATE}")
blocks+=("${TG_SUBJECT:-}"$'\n'"${TG_URL:-}")

msg=""
for b in "${blocks[@]}"; do
  [[ -n "$msg" ]] && msg+=$'\n\n'
  msg+="$b"
done

args=(
  --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}"
  --data-urlencode "disable_web_page_preview=true"
  --data-urlencode "text=${msg}"
)
# Post into a specific forum topic when configured.
[[ -n "${TELEGRAM_TOPIC_ID:-}" ]] && args+=( --data-urlencode "message_thread_id=${TELEGRAM_TOPIC_ID}" )

curl -sS --fail-with-body \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  "${args[@]}" >/dev/null
echo "telegram: sent${TELEGRAM_TOPIC_ID:+ (topic ${TELEGRAM_TOPIC_ID})}"
