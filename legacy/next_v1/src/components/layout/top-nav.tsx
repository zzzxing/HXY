'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVS = [
  { href: '/student/activities', label: '学生云游' },
  { href: '/teacher/activities/new', label: '教师驾驶舱' },
  { href: '/admin/users', label: '后台' }
];

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_FORCE_DEMO_MODE === '1';

export function TopNav() {
  const pathname = usePathname();

  return (
    <>
      {isDemoMode ? (
        <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-800">
          当前为本地演示模式：未连接 Supabase，数据不会同步到云端。
        </div>
      ) : null}
      <nav className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="container-mobile flex items-center gap-4 py-3 text-sm">
          <span className="font-semibold text-primary">黄小游 V3</span>
          {NAVS.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? 'font-semibold text-primary' : 'text-muted'}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
