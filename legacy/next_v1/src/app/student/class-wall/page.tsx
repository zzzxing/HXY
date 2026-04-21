import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { classWall } from '@/lib/demo/store';

export default async function StudentClassWallPage() {
  await getSessionProfile('student');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">班级共学页</h1>
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold">优秀作品墙</h3>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {classWall.highlights.map((h) => <div key={h.id} className="rounded border p-2 text-sm">{h.student}：{h.title}</div>)}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">热门问题榜</h3>
          <ul className="mt-2 space-y-1 text-sm">{classWall.hotQuestions.map((q) => <li key={q}>• {q}</li>)}</ul>
        </Card>
      </div>
      <Card>
        <h3 className="font-semibold">小组进度</h3>
        <div className="mt-2 grid gap-2 md:grid-cols-3">{classWall.groupProgress.map((g) => <div key={g.group} className="rounded border p-2 text-sm">{g.group}：{g.rate}%</div>)}</div>
      </Card>
    </div>
  );
}
