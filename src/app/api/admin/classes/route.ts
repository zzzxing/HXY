import { fail, ok, requireProfile } from '../../_utils';

export async function GET() {
  const { profile, supabase } = await requireProfile();
  if (profile.role === 'admin') {
    const { data } = await supabase.from('classes').select('*,schools(name)').order('created_at', { ascending: false });
    return ok(data ?? []);
  }

  if (profile.role === 'teacher') {
    const { data } = await supabase.from('classes').select('*').eq('school_id', profile.school_id).order('created_at', { ascending: false });
    return ok(data ?? []);
  }

  return fail('仅管理员或教师可访问', 403);
}

export async function POST(req: Request) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'admin') return fail('仅管理员可访问', 403);
  const body = await req.json();
  const { data, error } = await supabase.from('classes').insert(body).select('*').single();
  if (error) return fail(error.message);
  return ok(data);
}
