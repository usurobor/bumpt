import { db } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Open/close a member's exposure window. Every public scan inherits the open window's context.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get('token') ?? '');
  if (!process.env.OPS_TOKEN || token !== process.env.OPS_TOKEN) {
    return new NextResponse('unauthorized', { status: 401 });
  }
  const member = String(form.get('member') ?? '');
  const action = form.get('action') ? String(form.get('action')) : null;
  const context = form.get('context') ? String(form.get('context')) : null;

  // Close any open window for this member.
  await db
    .from('exposure_sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('member_id', member)
    .is('ended_at', null);

  // Start a new window unless stopping.
  if (action !== 'stop' && context) {
    await db.from('exposure_sessions').insert({ member_id: member, context });
  }

  return NextResponse.redirect(
    new URL(`/ops/${encodeURIComponent(member)}?token=${encodeURIComponent(token)}`, req.url),
    303
  );
}
