import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// Records a bump request — the requester tapping "Ask to bump". In protocol terms
// this is an AdmissionRequest (status: pending); it is NEVER membership. You're in
// only when a member accepts you in person (BUMP-050 on main). This experiment
// measures bump requests only; the accept/receipt ceremony is built separately.
//
// A bump request MUST originate from a scanned member card: the POST is rejected
// unless `m`+`s` are present, `s` matches a real scan_events row, and `m` matches
// that scan's member. A forged/missing POST records nothing and redirects to the
// "scan first" state. No contact data: one anonymous first-party id dedupes repeat
// taps per (device, member).
//
// Dedupe cookie window: the experiment window + buffer (75 days), not a year.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 75;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const member_id = form.get('m') ? String(form.get('m')) : null;
  const scan_id = form.get('s') ? String(form.get('s')) : null;

  // Require scan-originated asks: `s` must match a real scan whose member is `m`.
  const scanFirst = NextResponse.redirect(new URL('/about', req.url), 303);
  if (!member_id || !scan_id) return scanFirst;

  const rows = await sql`select member_id from scan_events where scan_id = ${scan_id}`;
  const scan = rows[0] as { member_id: string } | undefined;
  if (!scan || scan.member_id !== member_id) return scanFirst;

  let deviceId = req.cookies.get('bw_id')?.value;
  const res = NextResponse.redirect(new URL('/thanks', req.url), 303);
  if (!deviceId) {
    deviceId = randomUUID();
    res.cookies.set('bw_id', deviceId, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: COOKIE_MAX_AGE });
  }

  // Repeat taps from one device to the same member dedupe; a different member counts.
  await sql`
    insert into bump_request_events (device_id, member_id, scan_id)
    values (${deviceId}, ${member_id}, ${scan_id})
    on conflict (device_id, member_id) do nothing`;

  return res;
}
