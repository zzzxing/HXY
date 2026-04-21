import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoTasks, demoMediaAssets } from '@/lib/demo/store';

export default async function TeacherCaseTasksPage({ params }: { params: { caseId: string } }) {
  await getSessionProfile('teacher');
  const tasks = demoTasks.filter((t: any) => t.case_id === params.caseId);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">任务配置页</h1>
      <div className="grid gap-3 lg:grid-cols-2">
        {tasks.map((t: any) => (
          <Card key={t.id} className="space-y-1">
            <p className="text-xs text-muted">{t.phase}</p>
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-muted">{t.description}</p>
            <p className="text-xs">推荐资源：{t.required_assets.map((id: string) => demoMediaAssets.find((a: any) => a.id === id)?.title).join('、')}</p>
            <p className="text-xs">关键线索：{t.key_clue_assets.map((id: string) => demoMediaAssets.find((a: any) => a.id === id)?.title).join('、')}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
