import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isDemoMode } from '@/lib/demo/mode';
import { getDemoProfile, getDemoRoleFromCookie } from '@/lib/demo/store';

export function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function requireProfile() {
  if (isDemoMode()) {
    const role = getDemoRoleFromCookie(headers().get('cookie'));
    const profile = getDemoProfile(role);
    return { profile, user: { id: profile.id, email: `${profile.role}@demo.local` }, supabase: null };
  }

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) {
    throw new Error('PROFILE_NOT_FOUND');
  }

  return { profile, user, supabase };
}
