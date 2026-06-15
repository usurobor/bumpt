import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Reached only from a scanned card's "What is this?" (carries m + s). Records the
// About open, then offers the one-tap want-in. This is the only place the button lives.
export default async function About({ searchParams }: { searchParams: { m?: string; s?: string } }) {
  const m = searchParams.m ?? null;
  const s = searchParams.s ?? null;
  if (m || s) await sql`insert into about_events (member_id, scan_id) values (${m}, ${s})`;

  return (
    <main style={{ lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Bump is in-person only.</h1>
      <p><strong>You can&apos;t sign up online — you get bumped in.</strong></p>
      <p>
        Bump is a new protocol for real-world scenes. You wear a tag. People nearby can scan it
        to see only what you chose to show right now.
      </p>
      <p style={{ color: '#666' }}>No feed. No followers. No remote invite links.</p>

      <p style={{ marginTop: 32 }}>
        We&apos;re testing the front door:<br />
        <strong>did this make you want in?</strong>
      </p>
      <form action="/api/want-in" method="post">
        <input type="hidden" name="m" value={m ?? ''} />
        <input type="hidden" name="s" value={s ?? ''} />
        <button type="submit" style={{ padding: 14, fontSize: 18, width: '100%' }}>I want in</button>
      </form>

      <p style={{ marginTop: 40, fontSize: 12 }}>
        <a href="/privacy" style={{ color: '#999' }}>privacy</a>
      </p>
    </main>
  );
}
