import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PageTitle } from '@/components/layout/page-title';
import { getSessionProfile } from '@/lib/auth/session';
import { isDemoMode } from '@/lib/demo/mode';
import { demoActivity, demoSites } from '@/lib/demo/store';

export default async function StudentActivityDetailPage({ params }: { params: { id: string } }) {
  const { supabase } = await getSessionProfile('student');

  const activity = isDemoMode()
    ? (params.id === demoActivity.id ? demoActivity : demoActivity)
    : await supabase!.from('activities').select('*').eq('id', params.id).single().then((r) => r.data);

  const sites = isDemoMode()
    ? demoSites.filter((x) => x.activity_id === activity.id)
    : await supabase!.from('activity_sites').select('*').eq('activity_id', params.id).order('order_index').then((r) => r.data ?? []);

  return (
    <div className="space-y-3">
      <PageTitle title={activity?.title ?? '活动详情'} desc={activity?.description ?? ''} />
      <Card className="space-y-2 bg-sky-50">
        <p className="text-sm">主题：{activity?.theme}</p>
        <p className="text-sm">阶段入口：</p>
        <div className="mt-1 flex flex-wrap gap-3 text-sm">
          <Link href={`/student/activities/${activity.id}/learn`} className="text-primary">学：课前导学</Link>
          <Link href={`/student/activities/${activity.id}/research`} className="text-primary">研：任务探究</Link>
          <Link href={`/student/activities/${activity.id}/visit`} className="text-primary">游：路线地图</Link>
          <Link href={`/student/activities/${activity.id}/portfolio`} className="text-primary">学习档案</Link>
        </div>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">点位路线</h3>
        <ul className="space-y-1 text-sm">
          {(sites ?? []).map((site: any) => (
            <li key={site.id}>
              <Link className="text-primary" href={`/student/sites/${site.id}`}>{site.order_index}. {site.name}</Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
