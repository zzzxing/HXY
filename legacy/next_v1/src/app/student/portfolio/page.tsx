import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoState, demoSites, demoMediaAssets } from '@/lib/demo/store';

export default async function StudentPortfolioLandingPage() {
  const { profile } = await getSessionProfile('student');
  const portfolio = demoState.portfolios.find((x) => x.student_id === profile.id);
  const selected = demoState.evidences.filter((x: any) => x.student_id === profile.id && x.in_portfolio);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">学习档案</h1>
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold">问题—证据—解释—结论链路</h3>
          <ol className="mt-3 space-y-2 border-l pl-4 text-sm">
            {selected.map((e: any) => {
              const asset = demoMediaAssets.find((a: any) => a.id === e.resource_asset_id);
              return (
                <li key={e.id}>
                  <p className="font-medium">{demoSites.find((s) => s.id === e.site_id)?.name}</p>
                  <p>证据：{asset?.title || e.text_content || '文本记录'}</p>
                  <p>观察：{e.observation || '—'}</p>
                  <p>解释：{e.explanation || '—'}</p>
                  <p>结论：{e.conclusion || '—'}</p>
                </li>
              );
            })}
          </ol>
        </Card>
        <Card>
          <h3 className="font-semibold">教师反馈</h3>
          <p className="mt-2 text-sm">评分：{portfolio?.teacher_score ?? '--'}</p>
          <p className="mt-1 text-sm">评语：{portfolio?.teacher_comment ?? '等待评价'}</p>
        </Card>
      </div>
    </div>
  );
}
