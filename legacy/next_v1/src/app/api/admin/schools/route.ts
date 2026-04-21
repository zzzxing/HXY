import { fail, ok, requireProfile } from '../../_utils';

export async function GET() {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'admin') return fail('仅管理员可访问', 403);
  const { data } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
  return ok(data ?? []);
}

export async function POST(req: Request) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'admin') return fail('仅管理员可访问', 403);
  const body = await req.json();
  const { data, error } = await supabase.from('schools').insert(body).select('*').single();
  if (error) return fail(error.message);
  return ok(data);
}
