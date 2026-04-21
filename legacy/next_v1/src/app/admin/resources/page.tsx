'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/features/activities/activity-helpers';

export default function AdminResourcesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'question_chain' | 'task' | 'site'>('site');
  const [content, setContent] = useState('{"text":"点位介绍","images":[],"video":"","audio":"","ai_context":""}');

  const load = async () => setRows(await api<any[]>('/api/admin/resources').catch(() => []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await api('/api/admin/resources', { method: 'POST', body: JSON.stringify({ type, title, content: JSON.parse(content) }) });
    setTitle('');
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">点位编辑器 / 资源模板库</h1>
      <Card className="space-y-2">
        <h3 className="font-semibold">新增模板（支持图文/视频/音频/AI上下文）</h3>
        <select className="w-full rounded border p-2" value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="site">点位模板</option>
          <option value="task">任务模板</option>
          <option value="question_chain">问题链模板</option>
        </select>
        <input className="w-full rounded border p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="模板标题" />
        <textarea className="w-full rounded border p-2 font-mono text-xs" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
        <Button onClick={create}>保存模板</Button>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">模板列表</h3>
        <ul className="space-y-2 text-sm">
          {rows.map((tpl) => (
            <li key={tpl.id} className="rounded border p-2">
              <p className="font-medium">{tpl.type} / {tpl.title}</p>
              <pre className="overflow-x-auto text-xs text-muted">{JSON.stringify(tpl.content, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
