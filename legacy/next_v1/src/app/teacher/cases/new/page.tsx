'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TeacherCaseNewPage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">新建案例页</h1>
      <Card className="space-y-2">
        <input className="w-full rounded border p-2" placeholder="案例标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full rounded border p-2" rows={3} placeholder="案例简介" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <p className="text-xs text-muted">支持从已有案例复制、保存为模板、草稿发布分离（当前为演示工作流）。</p>
        <Button onClick={() => alert(`已创建草稿：${title || '未命名案例'}`)}>创建草稿</Button>
      </Card>
    </div>
  );
}
