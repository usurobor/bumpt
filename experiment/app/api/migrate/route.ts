import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// One-off migration endpoint: runs the SQL posted in the request body (schema.sql)
// using the app's own runtime DATABASE_URL. Guarded by OPS_TOKEN. Idempotent when
// the SQL uses `IF NOT EXISTS` / `ON CONFLICT` (schema.sql does). Disposable POC tool.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  if (!process.env.OPS_TOKEN || token !== process.env.OPS_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.text();
  // The Neon HTTP driver runs one statement per call; split the script on ';'.
  const statements = body
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.split('\n').every((l) => l.trim().startsWith('--') || l.trim() === ''));

  const ran: string[] = [];
  try {
    for (const stmt of statements) {
      await sql(stmt);
      const head = stmt
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l && !l.startsWith('--')) ?? stmt;
      ran.push(head.slice(0, 60));
    }
  } catch (err) {
    return NextResponse.json(
      { error: String(err), ranBefore: ran },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, ran: ran.length, statements: ran });
}
