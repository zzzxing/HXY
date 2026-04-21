import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PageTitle } from '@/components/layout/page-title';
import { getSessionProfile } from '@/lib/auth/session';
import { listActivitiesForRole } from '@/features/activities/service';

export default async function StudentActivitiesPage() {
  const { profile } = await getSessionProfile('student');
  const activities = await listActivitiesForRole(profile.id, profile.role);

  return (
    <div className="space-y-3">
      <PageTitle title="我的研学活动" desc="查看可参加活动并进入学-研-游闭环" />
      {activities.map((activity: any) => (
        <Card key={activity.id}>
          <h3 className="font-semibold">{activity.title}</h3>
          <p className="text-sm text-muted">{activity.description}</p>
          <Link href={`/student/activities/${activity.id}`} className="mt-2 inline-block text-sm text-primary">
            查看活动详情
          </Link>
        </Card>
      ))}
    </div>
  );
}
