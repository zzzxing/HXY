import { fail, ok, requireProfile } from '../../../_utils';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可查看', 403);
  const { data } = await supabase.from('portfolios').select('*,profiles(name)').eq('activity_id', params.id).order('updated_at', { ascending: false });
  return ok(data ?? []);
}
