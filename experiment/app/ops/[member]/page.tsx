import { sql } from '@/lib/db';
import { activeContext } from '@/lib/context';

export const dynamic = 'force-dynamic';

const CONTEXTS = ['unprompted', 'after_conversation', 'member_directed', 'test', 'unknown'];
const hours = (ms: number) => ms / 3_600_000;

export default async function Ops({
  params, searchParams,
}: { params: { member: string }; searchParams: { token?: string } }) {
  const token = searchParams.token ?? '';
  if (!process.env.OPS_TOKEN || token !== process.env.OPS_TOKEN) {
    return <main><h1>Unauthorized</h1></main>;
  }

  const memberId = params.member;
  const memberRows = await sql`select * from members where id = ${memberId}`;
  const member = memberRows[0] as { bump_name: string } | undefined;
  if (!member) return <main><h1>Unknown member</h1></main>;

  const current = await activeContext(memberId);

  const sessions = await sql`select context, started_at, ended_at from exposure_sessions where member_id = ${memberId}`;
  const exposure: Record<string, number> = {};
  for (const s of sessions) {
    const start = new Date(s.started_at).getTime();
    const end = s.ended_at ? new Date(s.ended_at).getTime() : Date.now();
    exposure[s.context] = (exposure[s.context] ?? 0) + (end - start);
  }

  const scans = await sql`select context from scan_events where member_id = ${memberId}`;
  const scanByCtx: Record<string, number> = {};
  for (const s of scans) scanByCtx[s.context] = (scanByCtx[s.context] ?? 0) + 1;

  const aboutOpens = (await sql`select count(*)::int as n from about_events where member_id = ${memberId}`)[0]?.n ?? 0;
  const wantIns = (await sql`select count(*)::int as n from want_ins where member_id = ${memberId}`)[0]?.n ?? 0;

  const Win = ({ c, label }: { c: string; label: string }) => (
    <form action="/api/ops/window" method="post" style={{ display: 'inline-block', marginRight: 8, marginBottom: 8 }}>
      <input type="hidden" name="member" value={memberId} />
      <input type="hidden" name="context" value={c} />
      <input type="hidden" name="token" value={token} />
      <button type="submit">{label}</button>
    </form>
  );

  return (
    <main style={{ maxWidth: 640 }}>
      <h1>ops · {member.bump_name}</h1>
      <p>Active window: <strong>{current}</strong></p>
      <div>
        <Win c="unprompted" label="Start unprompted" />
        <Win c="after_conversation" label="Start after-conversation" />
        <Win c="member_directed" label="Start member-directed" />
        <Win c="test" label="Start test" />
        <form action="/api/ops/window" method="post" style={{ display: 'inline-block' }}>
          <input type="hidden" name="member" value={memberId} />
          <input type="hidden" name="action" value="stop" />
          <input type="hidden" name="token" value={token} />
          <button type="submit">Stop window</button>
        </form>
      </div>
      <h2>counts</h2>
      <ul>
        <li>About opens: {aboutOpens}</li>
        <li>Want-ins: {wantIns}</li>
      </ul>
      <h3>by context</h3>
      <table cellPadding={6} style={{ borderCollapse: 'collapse' }}>
        <thead><tr><th align="left">context</th><th>exposure (h)</th><th>scans</th><th>scans/h</th></tr></thead>
        <tbody>
          {CONTEXTS.map((c) => {
            const h = hours(exposure[c] ?? 0);
            const n = scanByCtx[c] ?? 0;
            return (
              <tr key={c}>
                <td>{c}</td><td align="center">{h.toFixed(2)}</td>
                <td align="center">{n}</td><td align="center">{h > 0 ? (n / h).toFixed(2) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ marginTop: 24 }}><a href={`/ops/export?token=${encodeURIComponent(token)}`}>Export CSV</a></p>
    </main>
  );
}
