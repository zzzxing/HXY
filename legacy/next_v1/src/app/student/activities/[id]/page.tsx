import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PageTitle } from '@/components/layout/page-title';
import { getSessionProfile } from '@/lib/auth/session';

export default async function StudentActivityDetailPage({ params }: { params: { id: string } }) {
  const { supabase } = await getSessionProfile('student');
  const { data: activity } = await supabase.from('activities').select('*').eq('id', params.id).single();
  const { data: sites } = await supabase.from('activity_sites').select('*').eq('activity_id', params.id).order('order_index');

  return (
    <div className="space-y-3">
      <PageTitle title={activity?.title ?? '活动详情'} desc={activity?.description ?? ''} />
      <Card>
        <p className="text-sm">主题：{activity?.theme}</p>
        <p className="text-sm">阶段入口：</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <Link href={`/student/activities/${params.id}/learn`} className="text-primary">学</Link>
          <Link href={`/student/activities/${params.id}/research`} className="text-primary">研</Link>
          <Link href={`/student/activities/${params.id}/visit`} className="text-primary">游</Link>
          <Link href={`/student/activities/${params.id}/portfolio`} className="text-primary">学习档案</Link>
        </div>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">点位列表</h3>
        <ul className="space-y-1 text-sm">
          {(sites ?? []).map((site) => (
            <li key={site.id}>
              <Link className="text-primary" href={`/student/sites/${site.id}`}>{site.order_index}. {site.name}</Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
