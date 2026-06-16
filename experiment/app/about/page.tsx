import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Reached only from a scanned card's "Ask to bump" (carries m + s). Records the
// About open, then offers the knock — "ask to bump". This is the only place it lives.
// A knock is an AdmissionRequest, never membership: you're in only when a member
// accepts you in person (see docs/PROTOCOL.md).
export default async function About({ searchParams }: { searchParams: { m?: string; s?: string } }) {
  const m = searchParams.m ?? null;
  const s = searchParams.s ?? null;
  if (m || s) await sql`insert into about_events (member_id, scan_id) values (${m}, ${s})`;

  return (
    <main style={{ lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>You can&apos;t join online.</h1>
      <p><strong>To get in, scan a member&apos;s tag and ask them to bump you.</strong></p>
      <p>They have to accept you in person — that&apos;s the whole protocol.</p>
      <p>
        Bump is for real-world scenes. You wear a tag. People nearby can scan it
        to see only what you chose to show right now.
      </p>
      <p style={{ color: '#666' }}>No feed. No followers. No remote invite links.</p>

      <p style={{ marginTop: 32 }}>
        We&apos;re testing the front door:<br />
        <strong>does this make you want to bump in?</strong>
      </p>
      <form action="/api/want-in" method="post">
        <input type="hidden" name="m" value={m ?? ''} />
        <input type="hidden" name="s" value={s ?? ''} />
        <button type="submit" style={{ padding: 14, fontSize: 18, width: '100%' }}>Ask to bump</button>
      </form>
      <p style={{ color: '#666', fontSize: 13, marginTop: 12 }}>
        Asking is just a knock. You&apos;re in only when a member accepts you in person.
      </p>

      <p style={{ marginTop: 40, fontSize: 12 }}>
        <a href="/privacy" style={{ color: '#999' }}>privacy</a>
      </p>
    </main>
  );
}
