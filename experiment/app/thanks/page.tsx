import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Thanks() {
  const rows = await sql`select count(*)::int as n from want_ins`;
  const count = rows[0]?.n ?? 0;
  return (
    <main style={{ textAlign: 'center' }}>
      <h1>You're on the list.</h1>
      <p>Come back in a month.</p>
      <p style={{ fontSize: 13, color: '#666' }}>
        You're not a member yet — you only get in through a bump, in person.
      </p>
      <p style={{ marginTop: 40, fontSize: 40, fontWeight: 700 }}>{count}</p>
      <p style={{ color: '#666', marginTop: 0 }}>people want in so far</p>
    </main>
  );
}
