import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ChatBox } from '@/features/ai/chat-box';
import { EvidenceUpload } from '@/features/evidences/evidence-upload';
import { SiteCompletion } from '@/features/evidences/site-completion';
import { getSessionProfile } from '@/lib/auth/session';
import { demoSites, demoTasks, demoState } from '@/lib/demo/store';

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const { profile } = await getSessionProfile('student');
  const site = demoSites.find((x) => x.id === params.siteId) ?? demoSites[0];
  const siteTasks = demoTasks.filter((x) => x.site_id === site.id);
  const evidences = demoState.evidences.filter((x) => x.site_id === site.id && x.student_id === profile.id);

  return (
    <div className="app-grid app-grid-3">
      <aside className="space-y-3">
        <Card>
          <h3 className="font-semibold">路线导航</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {demoSites.map((s) => <li key={s.id}><Link className={s.id === site.id ? 'font-semibold text-primary' : 'text-muted'} href={`/student/sites/${s.id}`}>{s.order_index}. {s.name}</Link></li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold">重点观察点</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{site.problem_chain.map((p, idx) => <li key={idx}>{p.content}</li>)}</ul>
        </Card>
      </aside>

      <section className="space-y-3">
        <Card className="space-y-3">
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-sm text-muted">{site.intro}</p>
          <img src={site.cover_image} alt={site.name} className="h-[320px] w-full rounded-xl object-cover" />
          <div className="grid gap-2 md:grid-cols-2">
            {site.gallery.map((img) => <img key={img} src={img} alt="点位图集" className="h-36 w-full rounded-lg object-cover" />)}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-semibold">视频讲解</p>
              <video controls src={site.video_url} className="h-44 w-full rounded-lg bg-black" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold">音频导览</p>
              <audio controls src={site.audio_url} className="w-full" />
              <p className="mt-3 text-sm"><span className="font-semibold">AI 知识上下文：</span>{site.ai_context}</p>
            </div>
          </div>
        </Card>
      </section>

      <aside className="space-y-3">
        <Card>
          <h3 className="font-semibold">任务卡</h3>
          <ul className="mt-2 space-y-2 text-sm">{siteTasks.map((t) => <li key={t.id}>• {t.title}<p className="text-xs text-muted">{t.description}</p></li>)}</ul>
        </Card>
        <ChatBox title="AI 导游" activityId={site.activity_id} siteId={site.id} phase="visit" />
        <ChatBox title="AI 探究教练" activityId={site.activity_id} siteId={site.id} phase="research" />
        <EvidenceUpload activityId={site.activity_id} siteId={site.id} />
        <SiteCompletion siteId={site.id} />
        <Card>
          <h3 className="font-semibold">我的证据记录</h3>
          <ul className="mt-2 space-y-1 text-sm">{evidences.map((e) => <li key={e.id}>{e.evidence_type}：{e.note || e.text_content}</li>)}</ul>
        </Card>
      </aside>
    </div>
  );
}
