'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { api<any[]>('/api/admin/users').then(setUsers).catch(() => setUsers([])); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">学校/班级/用户管理：用户台账</h1>
      <Card>
        <ul className="space-y-2 text-sm">{users.map((u) => <li key={u.id} className="rounded border p-2">{u.name} / {u.role}</li>)}</ul>
      </Card>
    </div>
  );
}
