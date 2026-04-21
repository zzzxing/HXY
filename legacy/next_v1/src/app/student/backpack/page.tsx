import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoState, demoSites } from '@/lib/demo/store';

export default async function BackpackPage() {
  const { profile } = await getSessionProfile('student');
  const evidences = demoState.evidences.filter((x) => x.student_id === profile.id);
  const questions = demoState.questions.filter((x) => x.student_id === profile.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">证据背包</h1>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">图片 / 文字证据</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {evidences.map((e) => <li key={e.id}>{demoSites.find((s) => s.id === e.site_id)?.name}：{e.note || e.text_content || e.file_url}</li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold">我的问题</h3>
          <ul className="mt-2 space-y-2 text-sm">{questions.map((q) => <li key={q.id}>[{q.phase}] {q.content}</li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
