import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// A want-in is a one-tap expression of interest — never membership (BUMP-000 §5.1).
// No personal data: an anonymous first-party id dedupes repeat taps.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const member_id = form.get('m') ? String(form.get('m')) : null;
  const scan_id = form.get('s') ? String(form.get('s')) : null;

  let deviceId = req.cookies.get('bw_id')?.value;
  const res = NextResponse.redirect(new URL('/thanks', req.url), 303);
  if (!deviceId) {
    deviceId = randomUUID();
    res.cookies.set('bw_id', deviceId, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  await sql`
    insert into want_ins (device_id, member_id, scan_id)
    values (${deviceId}, ${member_id}, ${scan_id})
    on conflict (device_id) do nothing`;

  return res;
}
