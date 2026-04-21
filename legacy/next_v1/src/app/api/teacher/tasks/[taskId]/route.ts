import { fail, ok, requireProfile } from '../../../_utils';
import { demoTasks } from '@/lib/demo/store';

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  const { profile } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可修改', 403);
  const body = await req.json();
  const idx = demoTasks.findIndex((x: any) => x.id === params.taskId);
  if (idx < 0) return fail('任务不存在', 404);
  demoTasks[idx] = { ...demoTasks[idx], ...body } as any;
  return ok(demoTasks[idx]);
}

export async function DELETE(_: Request, { params }: { params: { taskId: string } }) {
  const { profile } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可删除', 403);
  const idx = demoTasks.findIndex((x: any) => x.id === params.taskId);
  if (idx < 0) return fail('任务不存在', 404);
  demoTasks.splice(idx, 1);
  return ok({ id: params.taskId });
}
