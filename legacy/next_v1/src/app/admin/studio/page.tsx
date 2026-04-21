import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoScenic, demoSites, demoTasks } from '@/lib/demo/store';

export default async function AdminStudioPage() {
  await getSessionProfile('admin');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">管理端：景区内容录入台</h1>
      <Card>
        <h3 className="font-semibold">景区主题</h3>
        <p className="mt-1 text-sm">{demoScenic.title}</p>
        <p className="text-sm text-muted">{demoScenic.subtitle}</p>
      </Card>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card>
          <h3 className="font-semibold">线路管理</h3>
          <p className="mt-2 text-sm">已配置 {demoSites.length} 个点位</p>
          <Link href="/admin/resources" className="mt-2 inline-block text-sm text-primary">进入点位编辑器</Link>
        </Card>
        <Card>
          <h3 className="font-semibold">任务模板库</h3>
          <p className="mt-2 text-sm">内置 {demoTasks.length} 个任务模板</p>
          <Link href="/admin/resources" className="mt-2 inline-block text-sm text-primary">维护模板</Link>
        </Card>
        <Card>
          <h3 className="font-semibold">组织管理</h3>
          <div className="mt-2 flex gap-3 text-sm">
            <Link href="/admin/schools-classes" className="text-primary">学校/班级</Link>
            <Link href="/admin/users" className="text-primary">用户</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
