import { ok, requireProfile } from '../../../_utils';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();
  const query = supabase.from('evidences').select('*,profiles(name)').eq('activity_id', params.id).order('created_at', { ascending: false });
  if (profile.role === 'student') query.eq('student_id', profile.id);
  const { data } = await query;
  return ok(data ?? []);
}
