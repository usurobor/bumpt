import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get('token') ?? '');
  if (!process.env.OPS_TOKEN || token !== process.env.OPS_TOKEN) {
    return new NextResponse('unauthorized', { status: 401 });
  }
  const member = String(form.get('member') ?? '');
  const action = form.get('action') ? String(form.get('action')) : null;
  const context = form.get('context') ? String(form.get('context')) : null;

  await sql`update exposure_sessions set ended_at = now() where member_id = ${member} and ended_at is null`;
  if (action !== 'stop' && context) {
    await sql`insert into exposure_sessions (member_id, context) values (${member}, ${context})`;
  }

  return NextResponse.redirect(
    new URL(`/ops/${encodeURIComponent(member)}?token=${encodeURIComponent(token)}`, req.url), 303
  );
}
