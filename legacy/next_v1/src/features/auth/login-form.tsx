'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_FORCE_DEMO_MODE === '1';

function setDemoRole(role: 'student' | 'teacher' | 'admin') {
  document.cookie = `demo_role=${role}; path=/`;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('student@demo.local');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const gotoByRole = (role: string) => {
    if (role === 'student') router.push('/student/activities');
    else if (role === 'teacher') router.push('/teacher/activities/new');
    else router.push('/admin/users');
    router.refresh();
  };

  const onLogin = async () => {
    setError('');

    if (isDemoMode) {
      const role = email.includes('teacher') ? 'teacher' : email.includes('admin') ? 'admin' : 'student';
      setDemoRole(role as 'student' | 'teacher' | 'admin');
      gotoByRole(role);
      return;
    }

    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
      if (signError) return setError(signError.message);
      const me = await fetch('/api/me').then((r) => r.json());
      gotoByRole(me.data.role);
    } catch {
      setError('登录失败，请检查配置。你也可以清空 Supabase 配置后使用 Demo Mode。');
    }
  };

  return (
    <Card className="space-y-3">
      <h1 className="text-xl font-semibold">登录黄小游</h1>
      {isDemoMode ? <p className="rounded bg-amber-50 p-2 text-sm text-amber-700">当前为本地演示模式：未连接 Supabase，可直接体验学生端和教师端流程。</p> : null}
      <input className="w-full rounded border p-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" onClick={onLogin}>登录</Button>
      {isDemoMode ? (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <Button onClick={() => { setDemoRole('student'); gotoByRole('student'); }}>学生演示入口</Button>
          <Button onClick={() => { setDemoRole('teacher'); gotoByRole('teacher'); }}>教师演示入口</Button>
          <Button onClick={() => { setDemoRole('admin'); gotoByRole('admin'); }}>管理员演示入口</Button>
        </div>
      ) : null}
    </Card>
  );
}
