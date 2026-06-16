// Smoke test for the BUMP-101 experiment funnel. HTTP-only: drives a real scan ->
// about -> bump-request flow against a running build and asserts the user-visible
// contract (status codes, redirect, anonymous device cookie, 404 for an unknown
// member, scan-origination enforcement). The resulting *data* state (one bump
// request created + per-(device,member) dedupe + forged POST records nothing) is
// verified authoritatively against Postgres by the CI "Verify database state" step,
// since re-reading it through the app's rendered page is subject to render/proxy caching.
//
// Requires: app started with a seeded DB (members a/b/c) on SMOKE_BASE_URL.

import { writeFileSync } from 'node:fs';

const BASE = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

let passed = 0;
let failures = 0;
function check(cond, msg) {
  if (cond) {
    console.log(`  ok   ${msg}`);
    passed++;
  } else {
    console.error(`  FAIL ${msg}`);
    failures++;
  }
}

// Playwright-shaped stats so CI can build an aggregate line: expected = passed
// as expected, unexpected = failed, skipped = test.skip()d (none here).
function writeStats() {
  const path = process.env.SMOKE_STATS ?? 'smoke-stats.json';
  writeFileSync(path, JSON.stringify({ expected: passed, unexpected: failures, skipped: 0 }));
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

  // A real scanned About shows the enabled Ask-to-bump form.
  const aboutScanned = await fetch(`${BASE}/about?m=${memberId}&s=${scanId}`, { cache: 'no-store' });
  check(aboutScanned.status === 200, `/about (scanned) -> 200 (got ${aboutScanned.status})`);
  const scannedHtml = await aboutScanned.text();
  check(/action="\/api\/bump-request"/.test(scannedHtml), 'scanned /about renders the Ask-to-bump form');

  // Direct /about (no m+s) explains the rule but DISABLES the ask.
  const aboutDirect = await fetch(`${BASE}/about`, { cache: 'no-store' });
  const directHtml = await aboutDirect.text();
  check(/Scan a member first/.test(directHtml), 'direct /about shows the scan-first rule');
  check(/disabled/.test(directHtml) && !/action="\/api\/bump-request"/.test(directHtml),
    'direct /about disables the ask (no submit form)');

  // /thanks renders (it reads a live count); we don't assert the number here.
  const thanks = await fetch(`${BASE}/thanks`, { cache: 'no-store' });
  check(thanks.status === 200, `/thanks -> 200 (got ${thanks.status})`);
  check(/asked to bump in/.test(await thanks.text()), '/thanks renders the funnel page');

  // Forged POST without a real scan records nothing and redirects to scan-first state.
  const forged = await fetch(`${BASE}/api/bump-request`, {
    method: 'POST',
    body: new URLSearchParams({ m: 'a', s: 'not-a-real-scan-id' }),
    redirect: 'manual',
  });
  check(forged.status === 303, `forged POST -> 303 redirect (got ${forged.status})`);
  check((forged.headers.get('location') ?? '').endsWith('/about'), 'forged POST redirects to the scan-first /about');

  // Missing m+s POST also rejected to scan-first state.
  const empty = await fetch(`${BASE}/api/bump-request`, { method: 'POST', body: new URLSearchParams({}), redirect: 'manual' });
  check((empty.headers.get('location') ?? '').endsWith('/about'), 'POST with no m+s redirects to scan-first /about');

  // First real bump request: 303 -> /thanks, sets an anonymous device cookie.
  const post1 = await fetch(`${BASE}/api/bump-request`, {
    method: 'POST',
    body: new URLSearchParams({ m: memberId, s: scanId }),
    redirect: 'manual',
  });
  check(post1.status === 303, `POST /api/bump-request -> 303 (got ${post1.status})`);
  check((post1.headers.get('location') ?? '').endsWith('/thanks'), 'bump request redirects to /thanks');

  const setCookie = post1.headers.getSetCookie?.() ?? [];
  const cookie = setCookie.map((c) => c.split(';')[0]).find((c) => c.startsWith('bw_id='));
  check(!!cookie, 'bump request sets an anonymous bw_id device cookie');

  // Second request from the same device to the SAME member must 303 (and dedupe, asserted via DB).
  const post2 = await fetch(`${BASE}/api/bump-request`, {
    method: 'POST',
    body: new URLSearchParams({ m: memberId, s: scanId }),
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  });
  check(post2.status === 303, `repeat POST (same member) -> 303 (got ${post2.status})`);

  // Same device to a DIFFERENT member: scan member b, then ask. Counts for b (asserted via DB).
  const cardB = await fetch(`${BASE}/m/b`, { cache: 'no-store', redirect: 'manual' });
  const linkB = (await cardB.text()).match(/\/about\?m=([^&"]+)&(?:amp;)?s=([0-9a-fA-F-]{36})/);
  if (linkB) {
    const post3 = await fetch(`${BASE}/api/bump-request`, {
      method: 'POST',
      body: new URLSearchParams({ m: linkB[1], s: linkB[2] }),
      headers: cookie ? { cookie } : {},
      redirect: 'manual',
    });
    check(post3.status === 303, `POST (same device, different member) -> 303 (got ${post3.status})`);
  } else {
    check(false, '/m/b renders an About link carrying m and a scanId');
  }

  writeStats();
  if (failures) {
    console.error(`\nsmoke: ${failures} check(s) failed`);
    process.exit(1);
  }
  console.log('\nsmoke: HTTP funnel ok (data state verified separately via psql)');
}

main().catch((err) => {
  console.error('smoke: crashed', err);
  writeStats();
  process.exit(1);
});
