import { fail, ok, requireProfile } from '../../../_utils';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'student') return fail('仅学生可查看个人档案', 403);
  const { data } = await supabase
    .from('portfolios')
    .select('*,portfolio_items(*)')
    .eq('activity_id', params.id)
    .eq('student_id', profile.id)
    .single();
  return ok(data);
}
