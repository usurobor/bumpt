// Smoke test for the BUMP-101 experiment funnel. HTTP-only: drives a real scan ->
// about -> want-in flow against a running build and asserts the user-visible
// contract (status codes, redirect, anonymous device cookie, 404 for an unknown
// member). The resulting *data* state (want_in created + device-dedupe) is verified
// authoritatively against Postgres by the CI "Verify database state" step, since
// re-reading it through the app's rendered page is subject to render/proxy caching.
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

async function main() {
  console.log(`smoke: ${BASE}`);

  // Unknown member must 404 (notFound()), not 500.
  const missing = await fetch(`${BASE}/m/zzz-nope`, { cache: 'no-store', redirect: 'manual' });
  check(missing.status === 404, `/m/zzz-nope -> 404 (got ${missing.status})`);

  // Real scan renders the card and threads a scanId into the About link.
  const card = await fetch(`${BASE}/m/a`, { cache: 'no-store', redirect: 'manual' });
  check(card.status === 200, `/m/a -> 200 (got ${card.status})`);
  const cardHtml = await card.text();
  const link = cardHtml.match(/\/about\?m=([^&"]+)&(?:amp;)?s=([0-9a-fA-F-]{36})/);
  check(!!link, '/m/a renders an About link carrying m and a scanId');
  const memberId = link ? link[1] : 'a';
  const scanId = link ? link[2] : '';

  // /thanks renders (it reads a live count); we don't assert the number here.
  const thanks = await fetch(`${BASE}/thanks`, { cache: 'no-store' });
  check(thanks.status === 200, `/thanks -> 200 (got ${thanks.status})`);
  check(/people want in so far/.test(await thanks.text()), '/thanks renders the funnel page');

  // First want-in: 303 -> /thanks, sets an anonymous device cookie.
  const post1 = await fetch(`${BASE}/api/want-in`, {
    method: 'POST',
    body: new URLSearchParams({ m: memberId, s: scanId }),
    redirect: 'manual',
  });
  check(post1.status === 303, `POST /api/want-in -> 303 (got ${post1.status})`);
  check((post1.headers.get('location') ?? '').endsWith('/thanks'), 'want-in redirects to /thanks');

  const setCookie = post1.headers.getSetCookie?.() ?? [];
  const cookie = setCookie.map((c) => c.split(';')[0]).find((c) => c.startsWith('bw_id='));
  check(!!cookie, 'want-in sets an anonymous bw_id device cookie');

  // Second want-in from the same device must also 303 (and dedupe, asserted via DB).
  const post2 = await fetch(`${BASE}/api/want-in`, {
    method: 'POST',
    body: new URLSearchParams({ m: memberId, s: scanId }),
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  });
  check(post2.status === 303, `repeat POST /api/want-in -> 303 (got ${post2.status})`);

  if (failures) {
    console.error(`\nsmoke: ${failures} check(s) failed`);
    process.exit(1);
  }
  console.log('\nsmoke: HTTP funnel ok (data state verified separately via psql)');
}

main().catch((err) => {
  console.error('smoke: crashed', err);
  process.exit(1);
});
