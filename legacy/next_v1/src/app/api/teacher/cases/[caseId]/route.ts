import { fail, ok, requireProfile } from '../../../_utils';
import { demoCases, demoSites, demoMediaAssets, demoTasks } from '@/lib/demo/store';

export async function PATCH(req: Request, { params }: { params: { caseId: string } }) {
  const { profile } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可修改', 403);
  const body = await req.json();
  const idx = demoCases.findIndex((c: any) => c.id === params.caseId);
  if (idx < 0) return fail('案例不存在', 404);
  demoCases[idx] = { ...demoCases[idx], ...body } as any;
  return ok(demoCases[idx]);
}

export async function DELETE(_: Request, { params }: { params: { caseId: string } }) {
  const { profile } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可删除', 403);
  const i = demoCases.findIndex((c: any) => c.id === params.caseId);
  if (i < 0) return fail('案例不存在', 404);
  demoCases.splice(i, 1);
  for (let i = demoSites.length - 1; i >= 0; i--) if ((demoSites[i] as any).case_id === params.caseId) demoSites.splice(i, 1);
  for (let i = demoMediaAssets.length - 1; i >= 0; i--) if ((demoMediaAssets[i] as any).case_id === params.caseId) demoMediaAssets.splice(i, 1);
  for (let i = demoTasks.length - 1; i >= 0; i--) if ((demoTasks[i] as any).case_id === params.caseId) demoTasks.splice(i, 1);
  return ok({ id: params.caseId });
}
