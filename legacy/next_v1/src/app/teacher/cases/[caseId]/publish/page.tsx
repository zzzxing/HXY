import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoCases } from '@/lib/demo/store';

export default async function TeacherCasePublishPage({ params }: { params: { caseId: string } }) {
  await getSessionProfile('teacher');
  const c = demoCases.find((x) => x.id === params.caseId);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">发布到班级页</h1>
      <Card className="space-y-1 text-sm">
        <p>案例：{c?.title}</p>
        <p>当前状态：{c?.status}</p>
        <p>已发布班级：{c?.published_class_ids.join('、')}</p>
        <p>支持草稿/发布分离、模板复制后发布（演示数据流程）。</p>
      </Card>
    </div>
  );
}
