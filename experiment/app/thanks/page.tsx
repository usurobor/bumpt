import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// After-tap state. Global aggregate count only (momentum/mystery), never per-member.
export default async function Thanks() {
  const rows = await sql`select count(*)::int as n from want_ins`;
  const count = rows[0]?.n ?? 0;
  return (
    <main style={{ textAlign: 'center', paddingTop: 48 }}>
      <p style={{ fontSize: 44, fontWeight: 700, margin: 0 }}>{count}</p>
      <p style={{ color: '#666', marginTop: 4 }}>people want in.</p>

      <p style={{ marginTop: 44 }}>Come back in a month.</p>
      <p style={{ color: '#666' }}>You still only get in through an in-person bump.</p>

      <p style={{ marginTop: 48, fontSize: 12 }}>
        <a href="/privacy" style={{ color: '#999' }}>privacy</a>
      </p>
    </main>
  );
}
