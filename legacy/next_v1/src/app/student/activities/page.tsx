import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getSessionProfile } from '@/lib/auth/session';
import { demoCases, demoRoutes, demoSites, demoTasks, classWall, demoState } from '@/lib/demo/store';

export default async function StudentActivitiesPage() {
  await getSessionProfile('student');
  const demoCase = demoCases[0];
  const route = demoRoutes[0];
  const finished = demoState.progresses.length;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl p-8 text-white" style={{ backgroundImage: `linear-gradient(120deg,rgba(15,23,42,.78),rgba(30,64,175,.62)),url(${demoCase.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <p className="text-sm text-sky-100">信息技术课堂云游专题</p>
        <h1 className="mt-2 text-3xl font-bold lg:text-4xl">{demoCase.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-100 lg:text-base">{demoCase.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/student/activities/demo-activity-1/visit`} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900">开始云游</Link>
          <Link href="/student/tasks" className="rounded-lg border border-white/70 px-4 py-2 text-sm">进入任务中心</Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
        <Card className="xl:col-span-2">
          <h3 className="font-semibold">路线概览 · {route.title}</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {demoSites.map((site) => <div key={site.id} className="rounded-lg border p-2 text-sm">{site.order_index}. {site.name}</div>)}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">今日任务</h3>
          <ul className="mt-2 space-y-2 text-sm">{demoTasks.slice(0, 3).map((t) => <li key={t.id}>• {t.title}</li>)}</ul>
        </Card>
        <Card>
          <h3 className="font-semibold">学习进度</h3>
          <p className="mt-3 text-3xl font-bold text-primary">{Math.round((finished / demoSites.length) * 100)}%</p>
          <p className="text-sm text-muted">已完成 {finished}/{demoSites.length} 个点位</p>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-semibold">推荐点位</h3>
          <p className="mt-2 text-sm">{demoSites[1].name}</p>
          <Link className="mt-3 inline-block text-sm text-primary" href={`/student/sites/${demoSites[1].id}`}>进入探索</Link>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="font-semibold">班级热榜 / 优秀作品</h3>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {classWall.highlights.map((x) => <div key={x.id} className="rounded-lg border p-2 text-sm">{x.student}：{x.title}（👍{x.likes}）</div>)}
          </div>
          <Link href="/student/class-wall" className="mt-3 inline-block text-sm text-primary">查看班级共学页</Link>
        </Card>
      </section>
    </div>
  );
}
