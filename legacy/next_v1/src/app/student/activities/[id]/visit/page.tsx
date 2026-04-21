import Link from 'next/link';
import { PageTitle } from '@/components/layout/page-title';
import { getSessionProfile } from '@/lib/auth/session';
import { Card } from '@/components/ui/card';
import { isDemoMode } from '@/lib/demo/mode';
import { demoSites, demoState } from '@/lib/demo/store';

export default async function VisitPage({ params }: { params: { id: string } }) {
  const { profile, supabase } = await getSessionProfile('student');

  const sites = isDemoMode()
    ? demoSites.filter((x) => x.activity_id === params.id)
    : await supabase!.from('activity_sites').select('*').eq('activity_id', params.id).order('order_index').then((r) => r.data ?? []);

  const progress = isDemoMode()
    ? demoState.progresses.filter((x) => x.activity_id === params.id && x.student_id === profile.id)
    : await supabase!.from('site_progresses').select('site_id').eq('activity_id', params.id).eq('student_id', profile.id).then((r) => r.data ?? []);

  const evidences = isDemoMode()
    ? demoState.evidences.filter((x) => x.activity_id === params.id && x.student_id === profile.id)
    : await supabase!.from('evidences').select('site_id').eq('activity_id', params.id).eq('student_id', profile.id).then((r) => r.data ?? []);

  const doneSet = new Set((progress ?? []).map((p: any) => p.site_id));
  const evidenceCount: Record<string, number> = {};
  (evidences ?? []).forEach((e: any) => {
    if (!e.site_id) return;
    evidenceCount[e.site_id] = (evidenceCount[e.site_id] || 0) + 1;
  });

  return (
    <div className="space-y-3">
      <PageTitle title="云游路线 / 地图页" desc="课堂投屏友好的点位列表，支持查看完成状态与证据数量" />
      {(sites ?? []).map((site: any) => (
        <Card key={site.id} className="space-y-1 border-indigo-100">
          <h3 className="font-semibold">{site.order_index}. {site.name}</h3>
          <p className="text-sm text-muted">{site.intro}</p>
          <p className="mt-1 text-xs text-muted">证据数：{evidenceCount[site.id] ?? 0} / 状态：{doneSet.has(site.id) ? '已完成' : '未完成'}</p>
          <Link href={`/student/sites/${site.id}`} className="mt-2 inline-block text-sm text-primary">进入点位探索页</Link>
        </Card>
      ))}
    </div>
  );
}
