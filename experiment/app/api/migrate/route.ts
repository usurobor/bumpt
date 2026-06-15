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
  // Strip `--` line comments first (schema.sql has ';' inside comments), then
  // split into statements — the Neon HTTP driver runs one statement per call.
  const stripped = body
    .split('\n')
    .map((l) => {
      const i = l.indexOf('--');
      return i >= 0 ? l.slice(0, i) : l;
    })
    .join('\n');
  const statements = stripped
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

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
