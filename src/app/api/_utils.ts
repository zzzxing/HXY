import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function requireProfile() {
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
