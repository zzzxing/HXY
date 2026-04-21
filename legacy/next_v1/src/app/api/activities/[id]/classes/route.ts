import { fail, ok, requireProfile } from '../../../../_utils';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可配置班级', 403);

  const { class_ids } = await req.json();
  if (!Array.isArray(class_ids) || !class_ids.length) return fail('class_ids 不能为空');

  const rows = class_ids.map((class_id: string) => ({ activity_id: params.id, class_id }));
  const { error } = await supabase.from('activity_classes').upsert(rows, { onConflict: 'activity_id,class_id' });
  if (error) return fail(error.message);

  return ok(true);
}
