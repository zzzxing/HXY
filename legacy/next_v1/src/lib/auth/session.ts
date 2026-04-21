import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Profile, UserRole } from '@/types/domain';

export async function getSessionProfile(requiredRole?: UserRole) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single<Profile>();
  if (!profile) redirect('/login');
  if (requiredRole && profile.role !== requiredRole) {
    if (profile.role === 'student') redirect('/student/activities');
    if (profile.role === 'teacher') redirect('/teacher/activities/new');
    redirect('/admin/users');
  }

  return { user, profile, supabase };
}

export function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) throw new Error('权限不足');
}
