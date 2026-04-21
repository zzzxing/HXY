import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoMediaAssets } from '@/lib/demo/store';

export default async function TeacherCaseResourcesPage({ params }: { params: { caseId: string } }) {
  await getSessionProfile('teacher');
  const assets = demoMediaAssets.filter((a: any) => a.case_id === params.caseId);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">资源管理页</h1>
      <div className="grid gap-3 lg:grid-cols-2">
        {assets.map((a: any) => (
          <Card key={a.id}>
            <p className="text-xs text-muted">{a.type.toUpperCase()}</p>
            <h3 className="font-semibold">{a.title}</h3>
            <p className="mt-1 text-xs text-muted">站点：{a.site_id}</p>
            <p className="mt-1 break-all text-xs">{a.url || a.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
