import { fail, ok, requireProfile } from '../../_utils';

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'teacher') return fail('权限不足', 403);
  const body = await req.json();
  const { data, error } = await supabase.from('tasks').update(body).eq('id', params.taskId).select('*').single();
  if (error) return fail(error.message);
  return ok(data);
}
