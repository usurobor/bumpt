import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const hours = (ms: number) => ms / 3_600_000;
const key = (member: string, ctx: string) => `${member}|${ctx}`;
const CONTEXTS = ['unprompted', 'after_conversation', 'member_directed', 'test', 'unknown'];

// Per-member-per-context export so the BUMP-101 §7 bars compute directly.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  if (!process.env.OPS_TOKEN || token !== process.env.OPS_TOKEN) {
    return new NextResponse('unauthorized', { status: 401 });
  }

  const [members, scans, abouts, wantIns, sessions] = await Promise.all([
    sql`select id, bump_name from members`,
    sql`select scan_id, member_id, context from scan_events`,
    sql`select scan_id, member_id from about_events`,
    sql`select scan_id, member_id from want_ins`,
    sql`select member_id, context, started_at, ended_at from exposure_sessions`,
  ]);

  const scanMap = new Map<string, { member: string; context: string }>();
  for (const s of scans) scanMap.set(s.scan_id, { member: s.member_id, context: s.context });

  const exposureMs: Record<string, number> = {};
  for (const s of sessions) {
    const start = new Date(s.started_at).getTime();
    const end = s.ended_at ? new Date(s.ended_at).getTime() : Date.now();
    exposureMs[key(s.member_id, s.context)] = (exposureMs[key(s.member_id, s.context)] ?? 0) + (end - start);
  }

  const scanCount: Record<string, number> = {};
  for (const s of scans) scanCount[key(s.member_id, s.context)] = (scanCount[key(s.member_id, s.context)] ?? 0) + 1;

  const aboutScanIds: Record<string, Set<string>> = {};
  for (const a of abouts) {
    const info = a.scan_id ? scanMap.get(a.scan_id) : undefined;
    const member = info?.member ?? a.member_id;
    const context = info?.context ?? 'unknown';
    if (!member) continue;
    (aboutScanIds[key(member, context)] ??= new Set()).add(a.scan_id ?? `noscan:${Math.random()}`);
  }

  const wantCount: Record<string, number> = {};
  for (const w of wantIns) {
    const info = w.scan_id ? scanMap.get(w.scan_id) : undefined;
    const member = info?.member ?? w.member_id;
    const context = info?.context ?? 'unknown';
    if (!member) continue;
    wantCount[key(member, context)] = (wantCount[key(member, context)] ?? 0) + 1;
  }

  const rate = (num: number, den: number) => (den > 0 ? (num / den).toFixed(3) : '');
  const rows = [[
    'member_id', 'bump_name', 'context', 'exposure_hours', 'scans', 'scans_per_hour',
    'about_opens', 'want_ins', 'scan_to_about_rate', 'about_to_wantin_rate', 'scan_to_wantin_rate',
  ]];
  for (const m of members) {
    for (const c of CONTEXTS) {
      const k = key(m.id, c);
      const h = hours(exposureMs[k] ?? 0);
      const scansN = scanCount[k] ?? 0;
      const opens = aboutScanIds[k]?.size ?? 0;
      const wants = wantCount[k] ?? 0;
      rows.push([
        m.id, m.bump_name, c, h.toFixed(3), String(scansN), h > 0 ? (scansN / h).toFixed(3) : '',
        String(opens), String(wants), rate(opens, scansN), rate(wants, opens), rate(wants, scansN),
      ]);
    }
  }

  const csv = rows.map((r) => r.map((x) => (/[",\n]/.test(x) ? `"${String(x).replace(/"/g, '""')}"` : x)).join(',')).join('\n');
  return new NextResponse(csv, {
    headers: { 'content-type': 'text/csv', 'content-disposition': 'attachment; filename="bump-101-export.csv"' },
  });
}
