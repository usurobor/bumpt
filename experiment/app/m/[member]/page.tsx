import { sql } from '@/lib/db';
import { activeContext } from '@/lib/context';
import { randomUUID } from 'crypto';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Card({ params }: { params: { member: string } }) {
  const rows = await sql`select * from members where id = ${params.member}`;
  const member = rows[0] as { id: string; bump_name: string; pic_url: string | null; static_line: string } | undefined;
  if (!member) notFound();

  const scanId = randomUUID();
  const context = await activeContext(member.id);
  await sql`insert into scan_events (scan_id, member_id, context) values (${scanId}, ${member.id}, ${context})`;

  return (
    <main style={{ textAlign: 'center' }}>
      {member.pic_url ? (
        <img src={member.pic_url} alt="" width={140} height={140} style={{ borderRadius: '50%', objectFit: 'cover' }} />
      ) : null}
      <h1 style={{ marginBottom: 4 }}>{member.bump_name}</h1>
      <p style={{ color: '#666', marginTop: 0 }}>{member.static_line}</p>

      <p style={{ marginTop: 28 }}>Bump is in-person only.</p>
      <p style={{ color: '#666', marginTop: 0 }}>Ask {member.bump_name} to bump you in.</p>

      <p style={{ marginTop: 28 }}>
        <a
          href={`/about?m=${encodeURIComponent(member.id)}&s=${encodeURIComponent(scanId)}`}
          style={{ display: 'inline-block', padding: '12px 22px', border: '1px solid #111', borderRadius: 8, textDecoration: 'none', color: '#111' }}
        >
          Ask to bump
        </a>
      </p>
    </main>
  );
}
