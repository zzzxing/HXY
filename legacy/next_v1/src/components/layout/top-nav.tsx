'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVS = [
  { href: '/student/activities', label: '学生端' },
  { href: '/teacher/dashboard', label: '教师端' },
  { href: '/admin/users', label: '管理端' }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
      <div className="container-mobile flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600" />
          <div>
            <p className="text-sm font-semibold leading-4">黄小游 V3.2</p>
            <p className="text-xs text-muted">课堂云游学习平台</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {NAVS.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? 'font-semibold text-primary' : 'text-muted'}>
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">切换身份</Link>
        </div>
      </div>
    </nav>
  );
}
