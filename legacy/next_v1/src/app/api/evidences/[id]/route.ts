import { fail, ok, requireProfile } from '../../_utils';
import { isDemoMode } from '@/lib/demo/mode';
import { demoState } from '@/lib/demo/store';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { profile } = await requireProfile();
  if (profile.role !== 'student') return fail('仅学生可修改', 403);
  const body = await req.json();

  if (isDemoMode()) {
    const idx = demoState.evidences.findIndex((x: any) => x.id === params.id && x.student_id === profile.id);
    if (idx < 0) return fail('证据不存在', 404);
    demoState.evidences[idx] = { ...demoState.evidences[idx], ...body } as any;
    return ok(demoState.evidences[idx]);
  }

  return fail('仅演示模式实现', 501);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { profile } = await requireProfile();
  if (profile.role !== 'student') return fail('仅学生可删除', 403);

  if (isDemoMode()) {
    demoState.evidences = demoState.evidences.filter((x: any) => !(x.id === params.id && x.student_id === profile.id));
    return ok({ id: params.id });
  }

  return fail('仅演示模式实现', 501);
}
