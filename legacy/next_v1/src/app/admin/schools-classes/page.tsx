'use client';

import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/layout/page-title';
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
    <div className="space-y-3">
      <PageTitle title="后台：学校/班级管理" />
      <Card>
        <h3 className="font-semibold">学校</h3>
        <ul className="text-sm">{schools.map((s) => <li key={s.id}>{s.name}</li>)}</ul>
      </Card>
      <Card>
        <h3 className="font-semibold">班级</h3>
        <ul className="text-sm">{classes.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
      </Card>
    </div>
  );
}
