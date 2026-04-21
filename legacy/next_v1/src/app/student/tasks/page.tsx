import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoTasks, demoState, demoSites } from '@/lib/demo/store';

export default async function StudentTasksPage() {
  await getSessionProfile('student');
  const doneSet = new Set(demoState.progresses.map((x) => x.site_id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">任务中心</h1>
      <div className="grid gap-3 lg:grid-cols-2">
        {demoTasks.map((task) => {
          const site = demoSites.find((s) => s.id === task.site_id);
          const done = task.site_id ? doneSet.has(task.site_id) : false;
          return (
            <Card key={task.id} className="space-y-2">
              <p className="text-xs text-muted">{task.phase.toUpperCase()} 阶段</p>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted">{task.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span>{done ? '已完成' : '待完成'}</span>
                {site ? <Link className="text-primary" href={`/student/sites/${site.id}`}>前往对应点位</Link> : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
