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
    else if (role === 'teacher') router.push('/teacher/dashboard');
    else router.push('/admin/studio');
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
      setError('登录失败，请检查账号或配置。');
    }
  };

  return (
    <Card className="mx-auto max-w-md space-y-3">
      <h1 className="text-xl font-semibold">登录黄小游</h1>
      <input className="w-full rounded border p-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" onClick={onLogin}>登录</Button>
      <p className="text-xs text-muted">示例：student@demo.local / teacher@demo.local / admin@demo.local</p>
    </Card>
  );
}
