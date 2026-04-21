import { fail, ok, requireProfile } from '../../../_utils';
import { isDemoMode } from '@/lib/demo/mode';
import { demoProfiles, demoState } from '@/lib/demo/store';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可查看', 403);

  if (isDemoMode()) {
    const list = demoState.portfolios.filter((x) => x.activity_id === params.id).map((x) => ({ ...x, profiles: { name: demoProfiles.student.name } }));
    return ok(list);
  }

  const { data } = await supabase!.from('portfolios').select('*,profiles(name)').eq('activity_id', params.id).order('updated_at', { ascending: false });
  return ok(data ?? []);
}
