import { createClient } from '@/lib/supabase/server';

export async function listActivitiesForRole(profileId: string, role: string) {
  const supabase = createClient();

  if (role === 'teacher') {
    const { data } = await supabase.from('activities').select('*').eq('teacher_id', profileId).order('created_at', { ascending: false });
    return data ?? [];
  }

  if (role === 'student') {
    const { data } = await supabase
      .from('activities')
      .select('*, activity_members!inner(student_id)')
      .eq('activity_members.student_id', profileId)
      .order('created_at', { ascending: false });
    return data ?? [];
  }

  const { data } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
  return data ?? [];
}
