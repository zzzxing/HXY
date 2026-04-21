import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoActivity, demoSites, demoState } from '@/lib/demo/store';

export default async function TeacherDashboardPage() {
  await getSessionProfile('teacher');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">教师首页 / 驾驶舱</h1>
      <div className="grid gap-3 lg:grid-cols-4">
        <Card><p className="text-xs text-muted">班级在线</p><p className="text-3xl font-bold">36</p></Card>
        <Card><p className="text-xs text-muted">当前主题</p><p className="font-semibold">{demoActivity.title}</p></Card>
        <Card><p className="text-xs text-muted">当前点位</p><p className="font-semibold">{demoSites[1].name}</p></Card>
        <Card><p className="text-xs text-muted">待点评</p><p className="text-3xl font-bold">{demoState.portfolios.length}</p></Card>
      </div>
      <Card>
        <h3 className="font-semibold">快捷控制</h3>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link className="text-primary" href="/teacher/console">课堂控制台</Link>
          <Link className="text-primary" href="/teacher/routes">景区 / 路线配置</Link>
          <Link className="text-primary" href="/teacher/tasks">任务布置</Link>
          <Link className="text-primary" href={`/teacher/activities/${demoActivity.id}/students`}>学生进度与档案评价</Link>
        </div>
      </Card>
    </div>
  );
}
