import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoState, demoSites } from '@/lib/demo/store';

export default async function StudentPortfolioLandingPage() {
  const { profile } = await getSessionProfile('student');
  const portfolio = demoState.portfolios.find((x) => x.student_id === profile.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">学习档案页</h1>
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold">问题—证据—解释—结论时间线</h3>
          <ol className="mt-3 space-y-2 border-l pl-4 text-sm">
            {demoState.evidences.map((e) => <li key={e.id}><span className="font-medium">{demoSites.find((s) => s.id === e.site_id)?.name}</span>：{e.text_content || e.note}</li>)}
          </ol>
        </Card>
        <Card>
          <h3 className="font-semibold">教师反馈</h3>
          <p className="mt-2 text-sm">评分：{portfolio?.teacher_score ?? '--'}</p>
          <p className="mt-1 text-sm">评语：{portfolio?.teacher_comment ?? '等待评价'}</p>
          <p className="mt-3 text-xs text-muted">成就反馈：工业观察者 Lv.2</p>
        </Card>
      </div>
    </div>
  );
}
