import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoSites } from '@/lib/demo/store';

export default async function TeacherCaseSitesPage({ params }: { params: { caseId: string } }) {
  await getSessionProfile('teacher');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">点位编辑页</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {demoSites.filter((s) => s.case_id === params.caseId).map((s) => (
          <Card key={s.id}>
            <h3 className="font-semibold">{s.order_index}. {s.name}</h3>
            <p className="mt-1 text-sm text-muted">{s.intro}</p>
            <p className="mt-2 text-xs">教师线索：{s.teacher_hint}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
