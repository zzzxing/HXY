import { fail, ok, requireProfile } from '../../../../_utils';
import { demoCases } from '@/lib/demo/store';

export async function POST(_: Request, { params }: { params: { caseId: string } }) {
  const { profile } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可复制', 403);
  const source = demoCases.find((c: any) => c.id === params.caseId);
  if (!source) return fail('案例不存在', 404);
  const cloned = { ...source, id: `case-${Date.now()}`, title: `${source.title}（副本）`, status: 'draft', version: 1, from_template_case_id: source.id };
  demoCases.unshift(cloned as any);
  return ok(cloned);
}
