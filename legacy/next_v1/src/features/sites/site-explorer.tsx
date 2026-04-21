'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ChatBox } from '@/features/ai/chat-box';
import { EvidenceUpload } from '@/features/evidences/evidence-upload';
import { SiteCompletion } from '@/features/evidences/site-completion';
import { api } from '@/features/activities/activity-helpers';

export function SiteExplorer({ site, sites, tasks, mediaAssets, evidences }: any) {
  const [assetType, setAssetType] = useState<'image' | 'video' | 'audio' | 'text' | 'ppt'>('image');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filtered = useMemo(() => mediaAssets.filter((x: any) => x.type === assetType), [mediaAssets, assetType]);
  const firstVideo = mediaAssets.find((x: any) => x.type === 'video');
  const firstAudio = mediaAssets.find((x: any) => x.type === 'audio');
  const textAssets = mediaAssets.filter((x: any) => x.type === 'text');

  const quoteToBackpack = async (assetId: string) => {
    await api('/api/evidences', {
      method: 'POST',
      body: JSON.stringify({
        activity_id: 'demo-activity-1',
        case_id: site.case_id,
        site_id: site.id,
        task_id: tasks[0]?.id ?? null,
        evidence_type: 'resource_image',
        resource_asset_id: assetId,
        note: '引用案例资源作为证据'
      })
    });
    window.location.href = '/student/backpack';
  };

  return (
    <div className="app-grid app-grid-3">
      <aside className="space-y-3">
        <Card>
          <h3 className="font-semibold">路线导航</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {sites.map((s: any) => <li key={s.id}><Link className={s.id === site.id ? 'font-semibold text-primary' : 'text-muted'} href={`/student/sites/${s.id}`}>{s.order_index}. {s.name}</Link></li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold">当前任务区</h3>
          <ul className="mt-2 space-y-2 text-sm">{tasks.map((t: any) => <li key={t.id}><p className="font-medium">{t.title}</p><p className="text-xs text-muted">{t.description}</p></li>)}</ul>
        </Card>
      </aside>

      <section className="space-y-3">
        <Card className="space-y-3">
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-sm text-muted">{site.intro}</p>
          <div className="flex flex-wrap gap-2">
            {['image', 'video', 'audio', 'text', 'ppt'].map((t) => (
              <button key={t} onClick={() => setAssetType(t as any)} className={`rounded-full px-3 py-1 text-xs ${assetType === t ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {t === 'image' ? '图集' : t === 'video' ? '视频' : t === 'audio' ? '音频' : t === 'text' ? '文本' : '附件'}
              </button>
            ))}
          </div>

          {assetType === 'image' ? (
            <div className="grid gap-2 md:grid-cols-2">
              {filtered.map((img: any) => (
                <div key={img.id} className="space-y-1">
                  <img src={img.url} alt={img.title} className="h-44 w-full cursor-zoom-in rounded-lg object-cover" onClick={() => setPreviewImage(img.url)} />
                  <div className="flex items-center justify-between text-xs">
                    <span>{img.title}</span>
                    <button className="text-primary" onClick={() => quoteToBackpack(img.id)}>引用到证据背包</button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {assetType === 'video' && firstVideo ? <video controls src={firstVideo.url} className="h-64 w-full rounded-lg bg-black" /> : null}
          {assetType === 'audio' && firstAudio ? <audio controls src={firstAudio.url} className="w-full" /> : null}
          {assetType === 'text' ? <div className="space-y-2">{textAssets.map((x: any) => <p key={x.id} className="rounded bg-slate-50 p-3 text-sm">{x.content}</p>)}</div> : null}
          {assetType === 'ppt' ? <ul className="list-disc pl-5 text-sm">{mediaAssets.filter((x: any) => x.type === 'ppt' || x.type === 'pdf' || x.type === 'link').map((x: any) => <li key={x.id}><a className="text-primary" href={x.url} target="_blank">{x.title}</a></li>)}</ul> : null}

          <p className="rounded bg-indigo-50 p-2 text-sm"><span className="font-semibold">观察点：</span>{site.teacher_hint}</p>
        </Card>
      </section>

      <aside className="space-y-3">
        <ChatBox title="AI 导游" activityId="demo-activity-1" siteId={site.id} phase="visit" />
        <ChatBox title="AI 探究教练" activityId="demo-activity-1" siteId={site.id} phase="research" />
        <EvidenceUpload activityId="demo-activity-1" siteId={site.id} />
        <SiteCompletion siteId={site.id} />
        <Card>
          <h3 className="font-semibold">证据记录</h3>
          <ul className="mt-2 space-y-1 text-sm">{evidences.map((e: any) => <li key={e.id}>{e.evidence_type}：{e.note || e.text_content}</li>)}</ul>
        </Card>
      </aside>

      {previewImage ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-6" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} className="max-h-full max-w-full rounded-xl object-contain" alt="预览" />
        </div>
      ) : null}
    </div>
  );
}
