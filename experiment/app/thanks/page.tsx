import { db } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Thanks() {
  const { count } = await db.from('want_ins').select('*', { count: 'exact', head: true });
  return (
    <main style={{ textAlign: 'center' }}>
      <h1>You're on the list.</h1>
      <p>Come back in a month.</p>
      <p style={{ fontSize: 13, color: '#666' }}>
        You're not a member yet — you only get in through a bump, in person.
      </p>
      <p style={{ marginTop: 40, fontSize: 40, fontWeight: 700 }}>{count ?? 0}</p>
      <p style={{ color: '#666', marginTop: 0 }}>people want in so far</p>
    </main>
  );
}
