import Link from 'next/link';
import { PageTitle } from '@/components/layout/page-title';
import { getSessionProfile } from '@/lib/auth/session';
import { Card } from '@/components/ui/card';

export default async function VisitPage({ params }: { params: { id: string } }) {
  const { profile, supabase } = await getSessionProfile('student');
  const [{ data: sites }, { data: progress }, { data: evidences }] = await Promise.all([
    supabase.from('activity_sites').select('*').eq('activity_id', params.id).order('order_index'),
    supabase.from('site_progresses').select('site_id').eq('activity_id', params.id).eq('student_id', profile.id),
    supabase.from('evidences').select('site_id').eq('activity_id', params.id).eq('student_id', profile.id)
  ]);

  const doneSet = new Set((progress ?? []).map((p) => p.site_id));
  const evidenceCount: Record<string, number> = {};
  (evidences ?? []).forEach((e) => {
    if (!e.site_id) return;
    evidenceCount[e.site_id] = (evidenceCount[e.site_id] || 0) + 1;
  });

  return (
    <div className="space-y-3">
      <PageTitle title="游板块：现场学习" desc="扫码或点击进入点位学习卡" />
      {(sites ?? []).map((site) => (
        <Card key={site.id}>
          <h3 className="font-semibold">{site.name}</h3>
          <p className="text-sm text-muted">{site.intro}</p>
          <p className="mt-1 text-xs text-muted">证据数：{evidenceCount[site.id] ?? 0} / 状态：{doneSet.has(site.id) ? '已完成' : '未完成'}</p>
          <Link href={`/student/sites/${site.id}`} className="mt-2 inline-block text-primary text-sm">进入点位学习卡</Link>
        </Card>
      ))}
    </div>
  );
}
