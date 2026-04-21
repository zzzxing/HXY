import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PageTitle } from '@/components/layout/page-title';
import { getSessionProfile } from '@/lib/auth/session';
import { listActivitiesForRole } from '@/features/activities/service';

export default async function StudentActivitiesPage() {
  const { profile } = await getSessionProfile('student');
  const activities = await listActivitiesForRole(profile.id, profile.role);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 p-5 text-white">
        <h1 className="text-2xl font-bold">课堂云游 · 学生前台</h1>
        <p className="mt-1 text-sm text-white/90">从路线探索到证据背包，再到学习档案，一次完整演示。</p>
      </section>
      <PageTitle title="我的研学活动" desc="选择活动后可进入地图路线、点位探索、证据收集与档案生成" />
      {activities.map((activity: any) => (
        <Card key={activity.id} className="space-y-2 border-sky-100">
          <h3 className="text-lg font-semibold">{activity.title}</h3>
          <p className="text-sm text-muted">{activity.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href={`/student/activities/${activity.id}`} className="text-primary">活动主页</Link>
            <Link href={`/student/activities/${activity.id}/visit`} className="text-primary">路线/地图</Link>
            <Link href={`/student/activities/${activity.id}/portfolio`} className="text-primary">学习档案</Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
