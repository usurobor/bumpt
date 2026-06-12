import { db, CONSENT_VERSION } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const CONSENT =
  "We'll only use your email to tell you where to find a future Bump. " +
  'Leaving your email does not make you a member. You can ask us to delete it any time.';

export default async function About({
  searchParams,
}: {
  searchParams: { m?: string; s?: string; err?: string };
}) {
  const m = searchParams.m ?? null;
  const s = searchParams.s ?? null;
  if (m || s) await db.from('about_events').insert({ member_id: m, scan_id: s });

  return (
    <main>
      <h1>Bump is in-person only.</h1>
      <p>
        Bump is a new network for real-world scenes — currently a work in progress. There is no feed,
        no followers, no profile to maintain. You wear a tag; people in the room see only what you
        choose, right now.
      </p>
      <p>
        <strong>You can't sign up online — you get bumped in, in person.</strong> Leave your email and
        we'll tell you where to find a bump.
      </p>

      {searchParams.err ? <p style={{ color: '#b00' }}>Please enter a valid email.</p> : null}

      <form action="/api/bump-request" method="post" style={{ marginTop: 24 }}>
        <input type="hidden" name="m" value={m ?? ''} />
        <input type="hidden" name="s" value={s ?? ''} />
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          style={{ width: '100%', padding: 12, fontSize: 16 }}
        />
        <button type="submit" style={{ marginTop: 12, padding: 12, fontSize: 16, width: '100%' }}>
          Tell me where to get bumped
        </button>
        <p style={{ fontSize: 13, color: '#666', marginTop: 12 }}>{CONSENT}</p>
        <input type="hidden" name="consent_version" value={CONSENT_VERSION} />
      </form>
    </main>
  );
}
