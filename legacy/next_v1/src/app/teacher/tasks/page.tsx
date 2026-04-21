import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoTasks } from '@/lib/demo/store';

export default async function TeacherTasksPage() {
  await getSessionProfile('teacher');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">任务布置页</h1>
      <div className="grid gap-3 lg:grid-cols-2">
        {demoTasks.map((t) => <Card key={t.id}><p className="text-xs text-muted">{t.phase}</p><h3 className="font-semibold">{t.title}</h3><p className="text-sm text-muted">{t.description}</p></Card>)}
      </div>
    </div>
  );
}
