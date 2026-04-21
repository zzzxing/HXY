import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoSites, demoState } from '@/lib/demo/store';

export default async function VisitPage({ params }: { params: { id: string } }) {
  await getSessionProfile('student');
  const sites = demoSites.filter((x) => x.activity_id === params.id);
  const doneSet = new Set(demoState.progresses.map((x) => x.site_id));
  const teacherSiteId = 'site-2';

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900 text-white">
        <h1 className="text-2xl font-bold">路线 / 地图页</h1>
        <p className="mt-1 text-sm text-slate-200">按照线路推进课堂云游，也可以自由进入任意点位。</p>
        <p className="mt-2 inline-block rounded bg-amber-300/20 px-2 py-1 text-xs text-amber-200">教师当前讲解点位：{sites.find((x) => x.id === teacherSiteId)?.name}</p>
      </Card>

      <div className="grid gap-3 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
        {sites.map((site) => (
          <Card key={site.id} className="space-y-2">
            <img src={site.cover_image} alt={site.name} className="h-36 w-full rounded-lg object-cover" />
            <p className="text-xs text-muted">第 {site.order_index} 站</p>
            <h3 className="font-semibold">{site.name}</h3>
            <p className="line-clamp-2 text-sm text-muted">{site.intro}</p>
            <div className="flex items-center justify-between text-xs">
              <span className={doneSet.has(site.id) ? 'text-emerald-600' : 'text-amber-600'}>{doneSet.has(site.id) ? '已完成' : '进行中'}</span>
              {site.id === teacherSiteId ? <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-600">教师讲解中</span> : null}
            </div>
            <Link href={`/student/sites/${site.id}`} className="inline-block text-sm text-primary">进入点位</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
