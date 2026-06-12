import { db } from '@/lib/supabase';
import { activeContext } from '@/lib/context';
import { randomUUID } from 'crypto';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// The worn-tag scan target. Renders the teaser node card and records one scan_event,
// tagged with the member's active exposure context. Threads scan_id into About.
export default async function Card({ params }: { params: { member: string } }) {
  const { data: member } = await db.from('members').select('*').eq('id', params.member).maybeSingle();
  if (!member) notFound();

  const scanId = randomUUID();
  const context = await activeContext(member.id);
  await db.from('scan_events').insert({ scan_id: scanId, member_id: member.id, context });

  return (
    <main style={{ textAlign: 'center' }}>
      {member.pic_url ? (
        <img src={member.pic_url} alt="" width={140} height={140} style={{ borderRadius: '50%', objectFit: 'cover' }} />
      ) : null}
      <h1 style={{ marginBottom: 4 }}>{member.bump_name}</h1>
      <p style={{ color: '#666', marginTop: 0 }}>{member.static_line}</p>
      <p style={{ marginTop: 32 }}>
        <a href={`/about?f=${encodeURIComponent(member.id)}&s=${encodeURIComponent(scanId)}`}>What is this?</a>
      </p>
    </main>
  );
}
