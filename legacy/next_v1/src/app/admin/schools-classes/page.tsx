'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

export default function AdminSchoolClassPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    api<any[]>('/api/admin/schools').then(setSchools).catch(() => setSchools([]));
    api<any[]>('/api/admin/classes').then(setClasses).catch(() => setClasses([]));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">学校 / 班级管理</h1>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">学校列表</h3>
          <ul className="mt-2 text-sm">{schools.map((s) => <li key={s.id} className="rounded border p-2">{s.name}</li>)}</ul>
        </Card>
        <Card>
          <h3 className="font-semibold">班级列表</h3>
          <ul className="mt-2 text-sm">{classes.map((c) => <li key={c.id} className="rounded border p-2">{c.name}</li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
