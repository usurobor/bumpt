import { sql } from '@/lib/db';

// A scan inherits the member's currently-open exposure window; none => 'unknown'.
export async function activeContext(memberId: string): Promise<string> {
  const rows = await sql`
    select context from exposure_sessions
    where member_id = ${memberId} and ended_at is null
    order by started_at desc limit 1`;
  return rows[0]?.context ?? 'unknown';
}
