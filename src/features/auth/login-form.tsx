'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onLogin = async () => {
    setError('');
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    if (signError) return setError(signError.message);
    const me = await fetch('/api/me').then((r) => r.json());
    const role = me.data.role;
    if (role === 'student') router.push('/student/activities');
    else if (role === 'teacher') router.push('/teacher/activities/new');
    else router.push('/admin/users');
    router.refresh();
  };

  return (
    <Card className="space-y-3">
      <h1 className="text-xl font-semibold">登录黄小游</h1>
      <input className="w-full rounded border p-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" onClick={onLogin}>登录</Button>
    </Card>
  );
}
