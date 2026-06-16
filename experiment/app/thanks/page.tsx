import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// After-tap state. Global unique-people count only (momentum/mystery), never
// per-member: distinct devices that have asked to bump, excluding test members.
export default async function Thanks() {
  const rows = await sql`
    select count(distinct device_id)::int as n
    from bump_request_events
    where member_id <> 'test'`;
  const count = rows[0]?.n ?? 0;
  return (
    <main style={{ textAlign: 'center', paddingTop: 48 }}>
      <p style={{ fontSize: 44, fontWeight: 700, margin: 0 }}>{count}</p>
      <p style={{ color: '#666', marginTop: 4 }}>have asked to bump in.</p>

      <p style={{ marginTop: 44 }}>Come back in a month.</p>
      <p style={{ color: '#666' }}>You still only get in when a member bumps you in, in person.</p>

      <p style={{ marginTop: 48, fontSize: 12 }}>
        <a href="/privacy" style={{ color: '#999' }}>privacy</a>
      </p>
    </main>
  );
}
