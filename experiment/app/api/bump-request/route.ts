import { db, CONSENT_VERSION } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// A bump request is a waitlist request, never membership (BUMP-000 §5.1).
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const member_id = form.get('f') ? String(form.get('f')) : null;
  const scan_id = form.get('s') ? String(form.get('s')) : null;

  if (!email || !email.includes('@')) {
    const back = new URL('/about', req.url);
    if (member_id) back.searchParams.set('f', member_id);
    if (scan_id) back.searchParams.set('s', scan_id);
    back.searchParams.set('err', '1');
    return NextResponse.redirect(back, 303);
  }

  // unique(email) dedupes demand; ignore duplicate submissions.
  await db
    .from('bump_requests')
    .upsert(
      { email, member_id, scan_id, consent_version: CONSENT_VERSION },
      { onConflict: 'email', ignoreDuplicates: true }
    );

  return NextResponse.redirect(new URL('/thanks', req.url), 303);
}
