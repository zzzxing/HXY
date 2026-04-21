import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';

export default async function TeacherCaseEditPage({ params }: { params: { caseId: string } }) {
  await getSessionProfile('teacher');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">编辑案例页</h1>
      <Card className="space-y-2 text-sm">
        <p>案例ID：{params.caseId}</p>
        <p>可编辑项：标题、封面、简介、版本号、草稿/发布状态、模板来源。</p>
      </Card>
    </div>
  );
}
