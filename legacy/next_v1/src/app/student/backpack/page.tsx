'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { demoState, demoSites, demoMediaAssets, demoTasks } from '@/lib/demo/store';
import { api } from '@/features/activities/activity-helpers';

export default function BackpackPage() {
  const [evidences, setEvidences] = useState<any[]>(demoState.evidences);

  const remove = async (id: string) => {
    await api(`/api/evidences/${id}`, { method: 'DELETE' });
    setEvidences((x) => x.filter((e) => e.id !== id));
  };

  const patch = async (id: string, payload: any) => {
    const data = await api<any>(`/api/evidences/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    setEvidences((rows) => rows.map((r) => (r.id === id ? data : r)));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">证据背包（案例资源引用）</h1>
      <p className="text-sm text-muted">优先从案例资源引用证据，再补充观察、解释与结论。本地上传仅作为补充入口。</p>
      <div className="grid gap-3">
        {evidences.map((e) => {
          const asset = demoMediaAssets.find((a) => a.id === e.resource_asset_id);
          const site = demoSites.find((s) => s.id === e.site_id);
          const task = demoTasks.find((t) => t.id === e.task_id);
          return (
            <Card key={e.id} className="space-y-2">
              <div className="grid gap-3 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-muted">引用资源</p>
                  {asset?.type === 'image' ? <img src={asset.url} alt={asset.title} className="mt-1 h-28 w-full rounded object-cover" /> : <p className="text-sm">{asset?.title ?? '文本证据'}</p>}
                </div>
                <div className="lg:col-span-2 space-y-2 text-sm">
                  <p><span className="font-semibold">点位：</span>{site?.name}</p>
                  <p><span className="font-semibold">任务：</span>{task?.title ?? '未关联'}</p>
                  <textarea className="w-full rounded border p-2" defaultValue={e.observation || ''} placeholder="我的观察" onBlur={(ev) => patch(e.id, { observation: ev.target.value })} />
                  <textarea className="w-full rounded border p-2" defaultValue={e.explanation || ''} placeholder="我的解释" onBlur={(ev) => patch(e.id, { explanation: ev.target.value })} />
                  <textarea className="w-full rounded border p-2" defaultValue={e.conclusion || ''} placeholder="我的结论" onBlur={(ev) => patch(e.id, { conclusion: ev.target.value })} />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => patch(e.id, { in_portfolio: true })}>一键加入学习档案</Button>
                    <Button className="bg-slate-500" onClick={() => remove(e.id)}>删除证据</Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
