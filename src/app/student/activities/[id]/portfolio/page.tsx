'use client';

import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/layout/page-title';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

export default function PortfolioPage({ params }: { params: { id: string } }) {
  const [portfolio, setPortfolio] = useState<any>(null);

  const load = async () => {
    const data = await api<any>(`/api/activities/${params.id}/portfolio`);
    setPortfolio(data);
  };

  useEffect(() => {
    load();
  }, []);

  const generate = async () => {
    await api(`/api/activities/${params.id}/portfolio/generate`, { method: 'POST' });
    await load();
  };

  return (
    <div className="space-y-3">
      <PageTitle title="我的学习档案" desc="由真实问题、任务、证据、评价汇总" />
      <Button onClick={generate}>生成/刷新档案</Button>
      {portfolio ? (
        <>
          <Card className="space-y-2 text-sm">
            <p><strong>系统总结：</strong>{portfolio.summary}</p>
            <p><strong>教师评分：</strong>{portfolio.teacher_score ?? '待评分'}</p>
            <p><strong>教师评语：</strong>{portfolio.teacher_comment ?? '待评语'}</p>
          </Card>
          <Card className="space-y-2 text-sm">
            <h3 className="font-semibold">档案明细</h3>
            {(portfolio.portfolio_items ?? []).map((item: any) => (
              <div key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.item_type}</p>
                <pre className="overflow-x-auto text-xs">{JSON.stringify(item.content, null, 2)}</pre>
              </div>
            ))}
          </Card>
        </>
      ) : (
        <Card>暂无档案，先点击生成。</Card>
      )}
    </div>
  );
}
