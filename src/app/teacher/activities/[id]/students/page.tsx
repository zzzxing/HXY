'use client';

import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/layout/page-title';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/features/activities/activity-helpers';

export default function TeacherStudentsPage({ params }: { params: { id: string } }) {
  const [evidences, setEvidences] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [comment, setComment] = useState('');
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

  useEffect(() => {
    load();
  }, []);

  const review = async (id: string) => {
    await api(`/api/portfolios/${id}/review`, { method: 'PATCH', body: JSON.stringify({ teacher_score: score, teacher_comment: comment }) });
    load();
  };

  return (
    <div className="space-y-3">
      <PageTitle title="学生过程与成果查看" desc="查看证据、点位完成、档案并完成评分评语" />
      <Card>
        <h3 className="mb-2 font-semibold">学生证据</h3>
        <ul className="space-y-1 text-sm">{evidences.map((e) => <li key={e.id}>{e.profiles?.name ?? '学生'} - {e.evidence_type} - {e.note || e.text_content}</li>)}</ul>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">点位完成记录</h3>
        <ul className="space-y-1 text-sm">{progress.map((p) => <li key={p.id}>{p.profiles?.name ?? '学生'} / {p.activity_sites?.name ?? '点位'} / {new Date(p.completed_at).toLocaleString()}</li>)}</ul>
      </Card>
      <Card className="space-y-2">
        <h3 className="font-semibold">档案评价</h3>
        <input className="w-full rounded border p-2" value={score} type="number" onChange={(e) => setScore(Number(e.target.value))} />
        <textarea className="w-full rounded border p-2" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="教师评语" />
        {portfolios.map((p) => (
          <div key={p.id} className="rounded border p-2 text-sm">
            <p>{p.profiles?.name}：{p.summary}</p>
            <p>当前评分：{p.teacher_score ?? '未评分'}</p>
            <Button className="mt-1" onClick={() => review(p.id)}>提交评价</Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
