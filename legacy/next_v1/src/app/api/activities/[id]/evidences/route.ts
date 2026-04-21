import { ok, requireProfile } from '../../../_utils';
import { isDemoMode } from '@/lib/demo/mode';
import { demoState, demoProfiles } from '@/lib/demo/store';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();

  if (isDemoMode()) {
    const list = demoState.evidences
      .filter((x) => x.activity_id === params.id && (profile.role === 'student' ? x.student_id === profile.id : true))
      .map((x) => ({ ...x, profiles: { name: demoProfiles.student.name } }));
    return ok(list);
  }

  const query = supabase!.from('evidences').select('*,profiles(name)').eq('activity_id', params.id).order('created_at', { ascending: false });
  if (profile.role === 'student') query.eq('student_id', profile.id);
  const { data } = await query;
  return ok(data ?? []);
}
