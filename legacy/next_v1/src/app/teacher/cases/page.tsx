import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoCases } from '@/lib/demo/store';

export default async function TeacherCasesPage() {
  await getSessionProfile('teacher');
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">案例列表页</h1>
        <Link href="/teacher/cases/new" className="text-sm text-primary">新建案例</Link>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {demoCases.map((c) => (
          <Card key={c.id}>
            <img src={c.cover_image} alt={c.title} className="h-40 w-full rounded-lg object-cover" />
            <h3 className="mt-2 font-semibold">{c.title}</h3>
            <p className="text-sm text-muted">{c.summary}</p>
            <p className="mt-1 text-xs">状态：{c.status} / 版本：v{c.version}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <Link href={`/teacher/cases/${c.id}/edit`} className="text-primary">编辑案例</Link>
              <Link href={`/teacher/cases/${c.id}/sites`} className="text-primary">点位编辑</Link>
              <Link href={`/teacher/cases/${c.id}/resources`} className="text-primary">资源管理</Link>
              <Link href={`/teacher/cases/${c.id}/tasks`} className="text-primary">任务配置</Link>
              <Link href={`/teacher/cases/${c.id}/publish`} className="text-primary">发布到班级</Link>
              <Link href="/student/activities" className="text-primary">预览学生端</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
