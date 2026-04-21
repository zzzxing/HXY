import { fail, ok, requireProfile } from '../../../_utils';
import { isDemoMode } from '@/lib/demo/mode';
import { demoState } from '@/lib/demo/store';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'student') return fail('仅学生可查看个人档案', 403);

  if (isDemoMode()) {
    const data = demoState.portfolios.find((x) => x.activity_id === params.id && x.student_id === profile.id) ?? null;
    return ok({ ...data, portfolio_items: demoState.evidences.filter((x) => x.activity_id === params.id).map((x, i) => ({ id: `item-${i}`, item_type: 'evidence', content: x })) });
  }

  const { data } = await supabase!
    .from('portfolios')
    .select('*,portfolio_items(*)')
    .eq('activity_id', params.id)
    .eq('student_id', profile.id)
    .single();
  return ok(data);
}
