import { fail, ok, requireProfile } from '../_utils';

export async function POST(req: Request) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'student') return fail('仅学生可提交证据', 403);
  const body = await req.json();
  const { data, error } = await supabase.from('evidences').insert({ ...body, student_id: profile.id }).select('*').single();
  if (error) return fail(error.message);
  return ok(data);
}
