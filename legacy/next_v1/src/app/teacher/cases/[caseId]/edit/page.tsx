'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/features/activities/activity-helpers';

export default function TeacherCaseEditPage({ params }: { params: { caseId: string } }) {
  const [item, setItem] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    api<any[]>('/api/teacher/cases').then((list) => {
      const c = list.find((x) => x.id === params.caseId);
      setItem(c);
      setForm(c || {});
    });
  }, [params.caseId]);

  const save = async () => {
    await api(`/api/teacher/cases/${params.caseId}`, { method: 'PATCH', body: JSON.stringify(form) });
    const list = await api<any[]>('/api/teacher/cases');
    setItem(list.find((x) => x.id === params.caseId));
  };

  if (!item) return <div className="text-sm text-muted">加载中...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">案例编辑页</h1>
      <Card className="space-y-2">
        <h3 className="font-semibold">基础信息</h3>
        <input className="w-full rounded border p-2" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="案例名称" />
        <input className="w-full rounded border p-2" value={form.cover_image || ''} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="封面图 URL" />
        <textarea className="w-full rounded border p-2" rows={3} value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="案例简介" />
        <Button onClick={save}>保存基础信息</Button>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">路线与点位</h3>
          <p className="mt-1 text-sm text-muted">进入点位编辑页可新增/排序/编辑点位及简介。</p>
          <Link href={`/teacher/cases/${params.caseId}/sites`} className="mt-2 inline-block text-sm text-primary">打开点位编辑</Link>
        </Card>
        <Card>
          <h3 className="font-semibold">点位资源库</h3>
          <p className="mt-1 text-sm text-muted">支持图片、视频、音频、文本、PPT/PDF/链接以及图注说明。</p>
          <Link href={`/teacher/cases/${params.caseId}/resources`} className="mt-2 inline-block text-sm text-primary">打开资源管理</Link>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card><h3 className="font-semibold">问题链</h3><p className="text-sm text-muted">可在点位编辑中维护主问题/子问题/提示语。</p></Card>
        <Card><h3 className="font-semibold">点位任务</h3><p className="text-sm text-muted">可配置观察、对比、证据选择、结论任务。</p><Link href={`/teacher/cases/${params.caseId}/tasks`} className="text-sm text-primary">任务配置</Link></Card>
        <Card><h3 className="font-semibold">证据候选资源</h3><p className="text-sm text-muted">在资源管理中为素材标记可引用证据与提示。</p></Card>
      </div>

      <Card>
        <h3 className="font-semibold">学生端预览</h3>
        <div className="mt-2 flex gap-3 text-sm">
          <Link href="/student/activities" className="text-primary">预览学生首页</Link>
          <Link href="/student/activities/demo-activity-1/visit" className="text-primary">预览路线页</Link>
          <Link href="/student/sites/site-2" className="text-primary">预览点位页</Link>
        </div>
      </Card>
    </div>
  );
}
