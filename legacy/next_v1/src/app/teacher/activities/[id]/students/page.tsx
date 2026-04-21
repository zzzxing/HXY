'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/features/activities/activity-helpers';
import { demoMediaAssets } from '@/lib/demo/store';

export default function TeacherStudentsPage({ params }: { params: { id: string } }) {
  const [evidences, setEvidences] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [comment, setComment] = useState('证据链完整，建议补充图像说明。');
  const [score, setScore] = useState(90);

  const load = async () => {
    const [ev, pf, pg] = await Promise.all([
      api<any[]>(`/api/activities/${params.id}/evidences`),
      api<any[]>(`/api/activities/${params.id}/portfolios`),
      api<any[]>(`/api/activities/${params.id}/progresses`).catch(() => [])
    ]);
    setEvidences(ev);
    setPortfolios(pf);
    setProgress(pg);
  };

  useEffect(() => { load(); }, []);

  const review = async (id: string) => {
    await api(`/api/portfolios/${id}/review`, { method: 'PATCH', body: JSON.stringify({ teacher_score: score, teacher_comment: comment }) });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">学生进度页 / 作品与档案评价页</h1>
        <Link href="/teacher/dashboard" className="text-sm text-primary">返回驾驶舱</Link>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card>
          <h3 className="mb-2 font-semibold">学生证据（含资源引用）</h3>
          <ul className="space-y-2 text-sm">
            {evidences.map((e) => {
              const asset = demoMediaAssets.find((a: any) => a.id === e.resource_asset_id);
              return <li key={e.id} className="rounded border p-2">{e.profiles?.name ?? '学生'} / 资源：{asset?.title || '未引用'} / 说明：{e.note || e.text_content}</li>;
            })}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">点位完成记录</h3>
          <ul className="space-y-1 text-sm">{progress.map((p) => <li key={p.id}>{p.profiles?.name ?? '学生'} / {p.activity_sites?.name ?? '点位'} / {new Date(p.completed_at).toLocaleString()}</li>)}</ul>
        </Card>
        <Card className="space-y-2">
          <h3 className="font-semibold">档案评价</h3>
          <input className="w-full rounded border p-2" value={score} type="number" onChange={(e) => setScore(Number(e.target.value))} />
          <textarea className="w-full rounded border p-2" value={comment} onChange={(e) => setComment(e.target.value)} />
          {portfolios.map((p) => (
            <div key={p.id} className="rounded border p-2 text-sm">
              <p>{p.profiles?.name}：{p.summary}</p>
              <p>当前评分：{p.teacher_score ?? '未评分'}</p>
              <p className="text-xs text-muted">证据是否支撑结论：可进一步补充多媒体证据。</p>
              <Button className="mt-2" onClick={() => review(p.id)}>提交评价</Button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
