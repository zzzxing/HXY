import { fail, ok, requireProfile } from '../_utils';
import { isDemoMode } from '@/lib/demo/mode';
import { demoState } from '@/lib/demo/store';

export async function POST(req: Request) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'student') return fail('仅学生可提交证据', 403);
  const body = await req.json();

  if (isDemoMode()) {
    const item = { id: `e-${Date.now()}`, ...body, student_id: profile.id, created_at: new Date().toISOString() };
    demoState.evidences.unshift(item as any);
    return ok(item);
  }

  const { data, error } = await supabase!.from('evidences').insert({ ...body, student_id: profile.id }).select('*').single();
  if (error) return fail(error.message);
  return ok(data);
}
