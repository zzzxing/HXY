import { fail, ok, requireProfile } from '../../_utils';

export async function GET() {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'admin') return fail('仅管理员可访问', 403);
  const { data } = await supabase.from('profiles').select('*,schools(name),classes(name)');
  return ok(data ?? []);
}
