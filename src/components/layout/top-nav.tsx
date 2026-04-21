'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVS = [
  { href: '/student/activities', label: '学生' },
  { href: '/teacher/activities/new', label: '教师' },
  { href: '/admin/users', label: '后台' }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 border-b bg-white">
      <div className="container-mobile flex items-center gap-3 py-3 text-sm">
        {NAVS.map((item) => (
          <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? 'font-semibold text-primary' : 'text-muted'}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
