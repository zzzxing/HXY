import { fail, ok, requireProfile } from '../../../_utils';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可查看', 403);
  const { data: activity } = await supabase.from('activities').select('teacher_id').eq('id', params.id).single();
  if (!activity || activity.teacher_id !== profile.id) return fail('权限不足', 403);

  const { data } = await supabase
    .from('site_progresses')
    .select('*,profiles(name),activity_sites(name)')
    .eq('activity_id', params.id)
    .order('completed_at', { ascending: false });

  return ok(data ?? []);
}
