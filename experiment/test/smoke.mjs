// Smoke test for the BUMP-101 experiment funnel. HTTP-only: drives a real scan ->
// about -> want-in flow against a running build, asserting status codes, a created
// want_in, device-dedupe, and 404 for an unknown member. No DB credentials needed;
// every assertion goes through the live app (and therefore the real Neon HTTP path).
//
// Requires: app started with a seeded DB (members a/b/c) on SMOKE_BASE_URL.

const BASE = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

let failures = 0;
function check(cond, msg) {
  if (cond) {
    console.log(`  ok   ${msg}`);
  } else {
    console.error(`  FAIL ${msg}`);
    failures++;
  }
}

// The big number on /thanks, tied to its label so style serialization can't break it.
async function wantInCount() {
  const r = await fetch(`${BASE}/thanks`, { cache: 'no-store' });
  check(r.status === 200, `/thanks -> 200 (got ${r.status})`);
  const html = await r.text();
  const m = html.match(/>(\d+)<\/p>\s*<p[^>]*>people want in so far</);
  check(!!m, '/thanks renders the live want-in count');
  return m ? Number(m[1]) : NaN;
}

async function scan(member) {
  const r = await fetch(`${BASE}/m/${member}`, { cache: 'no-store', redirect: 'manual' });
  return r;
}

async function main() {
  console.log(`smoke: ${BASE}`);

  // Unknown member must 404 (notFound()), not 500.
  const missing = await scan('zzz-nope');
  check(missing.status === 404, `/m/zzz-nope -> 404 (got ${missing.status})`);

  // Real scan renders the card and threads a scanId into the About link.
  const card = await scan('a');
  check(card.status === 200, `/m/a -> 200 (got ${card.status})`);
  const cardHtml = await card.text();
  const link = cardHtml.match(/\/about\?m=([^&"]+)&(?:amp;)?s=([0-9a-fA-F-]{36})/);
  check(!!link, '/m/a renders an About link carrying m and a scanId');
  const memberId = link ? link[1] : 'a';
  const scanId = link ? link[2] : '';

  const before = await wantInCount();

  // First want-in: 303 -> /thanks, sets an anonymous device cookie, creates one row.
  const body = new URLSearchParams({ m: memberId, s: scanId });
  const post1 = await fetch(`${BASE}/api/want-in`, { method: 'POST', body, redirect: 'manual' });
  check(post1.status === 303, `POST /api/want-in -> 303 (got ${post1.status})`);
  check((post1.headers.get('location') ?? '').endsWith('/thanks'), 'want-in redirects to /thanks');

  const setCookie = post1.headers.getSetCookie?.() ?? [];
  const cookie = setCookie.map((c) => c.split(';')[0]).find((c) => c.startsWith('bw_id='));
  check(!!cookie, 'want-in sets an anonymous bw_id device cookie');

  const afterFirst = await wantInCount();
  check(afterFirst === before + 1, `want-in count incremented (${before} -> ${afterFirst})`);

  // Second want-in from the same device must dedupe (on conflict do nothing).
  const post2 = await fetch(`${BASE}/api/want-in`, {
    method: 'POST',
    body: new URLSearchParams({ m: memberId, s: scanId }),
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  });
  check(post2.status === 303, `repeat POST /api/want-in -> 303 (got ${post2.status})`);

  const afterDup = await wantInCount();
  check(afterDup === afterFirst, `repeat tap deduped by device (stayed ${afterDup})`);

  if (failures) {
    console.error(`\nsmoke: ${failures} check(s) failed`);
    process.exit(1);
  }
  console.log('\nsmoke: all checks passed');
}

main().catch((err) => {
  console.error('smoke: crashed', err);
  process.exit(1);
});
