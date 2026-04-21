'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/features/activities/activity-helpers';
import { demoSites } from '@/lib/demo/store';

export default function TeacherCaseTasksPage({ params }: { params: { caseId: string } }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [siteId, setSiteId] = useState('site-1');

  const load = async () => setTasks(await api<any[]>(`/api/teacher/tasks?case_id=${params.caseId}`));
  useEffect(() => { load(); }, [params.caseId]);

  const add = async () => {
    await api('/api/teacher/tasks', { method: 'POST', body: JSON.stringify({ case_id: params.caseId, site_id: siteId, phase: 'visit', title, description: '新任务', required_assets: [], key_clue_assets: [] }) });
    setTitle('');
    load();
  };

  const update = async (id: string, patch: any) => { await api(`/api/teacher/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }); load(); };
  const remove = async (id: string) => { await api(`/api/teacher/tasks/${id}`, { method: 'DELETE' }); load(); };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">任务配置页</h1>
      <Card className="space-y-2">
        <div className="grid gap-2 md:grid-cols-2">
          <select className="rounded border p-2" value={siteId} onChange={(e) => setSiteId(e.target.value)}>{demoSites.filter((s: any) => s.case_id === params.caseId).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          <input className="rounded border p-2" placeholder="任务标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <Button onClick={add}>新增任务</Button>
      </Card>
      <div className="grid gap-3 lg:grid-cols-2">
        {tasks.map((t: any) => (
          <Card key={t.id} className="space-y-1">
            <input className="w-full rounded border p-2" value={t.title} onChange={(e) => update(t.id, { title: e.target.value })} />
            <textarea className="w-full rounded border p-2" rows={2} value={t.description} onChange={(e) => update(t.id, { description: e.target.value })} />
            <input className="w-full rounded border p-2" value={(t.required_assets || []).join(',')} onChange={(e) => update(t.id, { required_assets: e.target.value.split(',').filter(Boolean) })} placeholder="推荐资源ID（逗号分隔）" />
            <input className="w-full rounded border p-2" value={(t.key_clue_assets || []).join(',')} onChange={(e) => update(t.id, { key_clue_assets: e.target.value.split(',').filter(Boolean) })} placeholder="关键线索ID" />
            <Button className="bg-rose-600" onClick={() => remove(t.id)}>删除任务</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
