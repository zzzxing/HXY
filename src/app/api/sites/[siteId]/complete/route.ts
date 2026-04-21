import { fail, ok, requireProfile } from '../../../_utils';

export async function POST(req: Request, { params }: { params: { siteId: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'student') return fail('仅学生可标记完成', 403);

  const { note } = await req.json();
  const { data: site } = await supabase.from('activity_sites').select('id,activity_id').eq('id', params.siteId).single();
  if (!site) return fail('点位不存在', 404);

  const { data, error } = await supabase
    .from('site_progresses')
    .upsert({ activity_id: site.activity_id, site_id: params.siteId, student_id: profile.id, status: 'completed', note }, { onConflict: 'activity_id,site_id,student_id' })
    .select('*')
    .single();
  if (error) return fail(error.message);

  return ok(data);
}
