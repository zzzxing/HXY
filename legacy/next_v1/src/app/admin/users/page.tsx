'use client';

import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/layout/page-title';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    api<any[]>('/api/admin/users').then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <div className="space-y-3">
      <PageTitle title="后台：用户管理" desc="管理员查看用户、角色、学校与班级" />
      <Card>
        <ul className="space-y-1 text-sm">{users.map((u) => <li key={u.id}>{u.name} / {u.role}</li>)}</ul>
      </Card>
    </div>
  );
}
