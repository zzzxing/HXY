import { fail, ok, requireProfile } from '../../../_utils';

export async function PATCH(req: Request, { params }: { params: { portfolioId: string } }) {
  const { profile, supabase } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可评价', 403);
  const body = await req.json();
  const { data, error } = await supabase
    .from('portfolios')
    .update({ ...body, status: 'reviewed', updated_at: new Date().toISOString() })
    .eq('id', params.portfolioId)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(data);
}
