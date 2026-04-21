'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/features/activities/activity-helpers';

export default function TeacherCasesPage() {
  const [cases, setCases] = useState<any[]>([]);

  const load = async () => setCases(await api<any[]>('/api/teacher/cases'));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => { await api(`/api/teacher/cases/${id}`, { method: 'DELETE' }); load(); };
  const copy = async (id: string) => { await api(`/api/teacher/cases/${id}/copy`, { method: 'POST' }); load(); };
  const toggleStatus = async (c: any) => { await api(`/api/teacher/cases/${c.id}`, { method: 'PATCH', body: JSON.stringify({ status: c.status === 'published' ? 'draft' : 'published' }) }); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">案例列表页</h1>
        <Link href="/teacher/cases/new" className="text-sm text-primary">新建案例</Link>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {cases.map((c) => (
          <Card key={c.id}>
            <img src={c.cover_image} alt={c.title} className="h-40 w-full rounded-lg object-cover" />
            <h3 className="mt-2 font-semibold">{c.title}</h3>
            <p className="text-sm text-muted">{c.summary}</p>
            <p className="mt-1 text-xs">状态：{c.status} / 版本：v{c.version}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Link href={`/teacher/cases/${c.id}/edit`} className="text-primary">编辑案例</Link>
              <Link href={`/teacher/cases/${c.id}/sites`} className="text-primary">点位编辑</Link>
              <Link href={`/teacher/cases/${c.id}/resources`} className="text-primary">资源管理</Link>
              <Link href={`/teacher/cases/${c.id}/tasks`} className="text-primary">任务配置</Link>
              <Link href={`/teacher/cases/${c.id}/publish`} className="text-primary">发布到班级</Link>
              <Link href="/student/activities" className="text-primary">学生端预览</Link>
            </div>
            <div className="mt-2 flex gap-2">
              <Button className="px-3 py-1 text-xs" onClick={() => toggleStatus(c)}>{c.status === 'published' ? '转为草稿' : '发布'}</Button>
              <Button className="bg-slate-700 px-3 py-1 text-xs" onClick={() => copy(c.id)}>复制案例</Button>
              <Button className="bg-rose-600 px-3 py-1 text-xs" onClick={() => remove(c.id)}>删除案例</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
