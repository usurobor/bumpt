import { db } from '@/lib/supabase';

// A scan inherits the member's currently-open exposure window.
// No open window => 'unknown' (excluded from the hook metric).
export async function activeContext(memberId: string): Promise<string> {
  const { data } = await db
    .from('exposure_sessions')
    .select('context')
    .eq('member_id', memberId)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.context ?? 'unknown';
}
