import { PageTitle } from '@/components/layout/page-title';
import { QuestionList } from '@/features/questions/question-list';
import { getSessionProfile } from '@/lib/auth/session';
import { Card } from '@/components/ui/card';

export default async function ResearchPage({ params }: { params: { id: string } }) {
  const { supabase } = await getSessionProfile('student');
  const { data: tasks } = await supabase.from('tasks').select('*').eq('activity_id', params.id).eq('phase', 'research').order('sort_order');

  return (
    <div className="space-y-3">
      <PageTitle title="研板块：家庭探究" desc="完成资料卡并补充待验证问题" />
      <Card>
        <h3 className="mb-2 font-semibold">家庭任务</h3>
        <ul className="list-disc pl-5 text-sm">{(tasks ?? []).map((t) => <li key={t.id}>{t.title}：{t.description}</li>)}</ul>
      </Card>
      <QuestionList activityId={params.id} phase="research" />
    </div>
  );
}
