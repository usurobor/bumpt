import { db } from '@/lib/supabase';
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
    res.cookies.set('bw_id', deviceId, {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365,
    });
  }

  // unique(device_id) dedupes repeat taps; ignore duplicates.
  await db.from('want_ins').upsert(
    { device_id: deviceId, member_id, scan_id },
    { onConflict: 'device_id', ignoreDuplicates: true }
  );

  return res;
}
