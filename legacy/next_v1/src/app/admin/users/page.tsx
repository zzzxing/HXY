'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/features/activities/activity-helpers';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { api<any[]>('/api/admin/users').then(setUsers).catch(() => setUsers([])); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">管理员端：账号与权限管理</h1>
      <Card>
        <h3 className="mb-2 font-semibold">教师/学生账号列表</h3>
        <ul className="space-y-2 text-sm">
          {users.map((u) => (
            <li key={u.id} className="rounded border p-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>{u.name} / {u.role}</span>
                <div className="flex gap-2">
                  <Button className="bg-slate-700 px-3 py-1 text-xs">重置密码</Button>
                  <Button className="px-3 py-1 text-xs">调整权限</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
