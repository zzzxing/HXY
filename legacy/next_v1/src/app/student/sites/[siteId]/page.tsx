import { PageTitle } from '@/components/layout/page-title';
import { Card } from '@/components/ui/card';
import { ChatBox } from '@/features/ai/chat-box';
import { EvidenceUpload } from '@/features/evidences/evidence-upload';
import { SiteCompletion } from '@/features/evidences/site-completion';
import { getSessionProfile } from '@/lib/auth/session';
import { isDemoMode } from '@/lib/demo/mode';
import { demoSites, demoState } from '@/lib/demo/store';

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const { profile, supabase } = await getSessionProfile('student');

  const site = isDemoMode()
    ? demoSites.find((x) => x.id === params.siteId)
    : await supabase!.from('activity_sites').select('*').eq('id', params.siteId).single().then((r) => r.data);

  const evidences = isDemoMode()
    ? demoState.evidences.filter((x) => x.site_id === params.siteId && x.student_id === profile.id)
    : await supabase!
        .from('evidences')
        .select('*')
        .eq('site_id', params.siteId)
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false })
        .then((r) => r.data ?? []);

  return (
    <div className="space-y-3">
      <PageTitle title={site?.name ?? '点位探索页'} desc={site?.intro ?? ''} />
      <Card>
        <p className="text-sm">关键事实：{site?.key_facts ?? '暂无'}</p>
        <p className="mt-2 text-sm font-medium">问题链</p>
        <ul className="list-disc pl-5 text-sm">{(site?.problem_chain ?? []).map((x: any, idx: number) => <li key={idx}>{x.content}</li>)}</ul>
        <p className="mt-2 text-sm font-medium">证据清单</p>
        <ul className="list-disc pl-5 text-sm">{(site?.evidence_checklist ?? []).map((x: string, idx: number) => <li key={idx}>{x}</li>)}</ul>
      </Card>
      <ChatBox activityId={site?.activity_id ?? 'demo-activity-1'} siteId={params.siteId} phase="visit" />
      <EvidenceUpload activityId={site?.activity_id ?? 'demo-activity-1'} siteId={params.siteId} />
      <SiteCompletion siteId={params.siteId} />
      <Card>
        <h3 className="mb-2 font-semibold">我在本点位的证据记录</h3>
        <ul className="space-y-1 text-sm">
          {(evidences ?? []).map((e: any) => (
            <li key={e.id}>{e.evidence_type} - {e.note || e.text_content || e.file_url}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
