import { db } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function About({
  searchParams,
}: {
  searchParams: { m?: string; s?: string };
}) {
  const m = searchParams.m ?? null;
  const s = searchParams.s ?? null;
  if (m || s) await db.from('about_events').insert({ member_id: m, scan_id: s });

  return (
    <main>
      <h1>Bump is in-person only.</h1>
      <p>
        Bump is a new network for real-world scenes — a work in progress. No feed, no followers,
        no profile to maintain. You wear a tag; people in the room see only what you choose, right now.
      </p>
      <p>
        <strong>You can't sign up online — you get bumped in, in person.</strong>
      </p>

      <form action="/api/want-in" method="post" style={{ marginTop: 24 }}>
        <input type="hidden" name="m" value={m ?? ''} />
        <input type="hidden" name="s" value={s ?? ''} />
        <button type="submit" style={{ padding: 14, fontSize: 18, width: '100%' }}>
          I want in
        </button>
        <p style={{ fontSize: 13, color: '#666', marginTop: 12 }}>
          One tap — no email, no signup. Just so we know you want in. Come back in a month.
        </p>
      </form>
    </main>
  );
}
