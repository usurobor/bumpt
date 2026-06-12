import { db } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const hours = (ms: number) => ms / 3_600_000;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  if (!process.env.OPS_TOKEN || token !== process.env.OPS_TOKEN) {
    return new NextResponse('unauthorized', { status: 401 });
  }

  const [{ data: members }, { data: scans }, { data: abouts }, { data: reqs }, { data: sessions }] =
    await Promise.all([
      db.from('members').select('id,bump_name'),
      db.from('scan_events').select('member_id,context'),
      db.from('about_events').select('member_id'),
      db.from('bump_requests').select('member_id'),
      db.from('exposure_sessions').select('member_id,context,started_at,ended_at'),
    ]);

  const exposure: Record<string, Record<string, number>> = {};
  for (const s of sessions ?? []) {
    const start = new Date(s.started_at).getTime();
    const end = s.ended_at ? new Date(s.ended_at).getTime() : Date.now();
    (exposure[s.member_id] ??= {})[s.context] = ((exposure[s.member_id] ?? {})[s.context] ?? 0) + (end - start);
  }
  const scanByCtx: Record<string, Record<string, number>> = {};
  for (const s of scans ?? []) (scanByCtx[s.member_id] ??= {})[s.context] = ((scanByCtx[s.member_id] ?? {})[s.context] ?? 0) + 1;
  const aboutBy: Record<string, number> = {};
  for (const a of abouts ?? []) if (a.member_id) aboutBy[a.member_id] = (aboutBy[a.member_id] ?? 0) + 1;
  const reqBy: Record<string, number> = {};
  for (const r of reqs ?? []) if (r.member_id) reqBy[r.member_id] = (reqBy[r.member_id] ?? 0) + 1;

  const contexts = ['unprompted', 'after_conversation', 'member_directed', 'test', 'unknown'];
  const rows = [['member_id', 'bump_name', 'context', 'exposure_hours', 'scans', 'scans_per_hour', 'member_about_opens', 'member_bump_requests']];
  for (const m of members ?? []) {
    for (const c of contexts) {
      const h = hours(exposure[m.id]?.[c] ?? 0);
      const n = scanByCtx[m.id]?.[c] ?? 0;
      rows.push([m.id, m.bump_name, c, h.toFixed(3), String(n), h > 0 ? (n / h).toFixed(3) : '', String(aboutBy[m.id] ?? 0), String(reqBy[m.id] ?? 0)]);
    }
  }
  const csv = rows.map((r) => r.map((x) => (/[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(',')).join('\n');
  return new NextResponse(csv, {
    headers: { 'content-type': 'text/csv', 'content-disposition': 'attachment; filename="bump-101-export.csv"' },
  });
}
