import { createClient } from '@/lib/supabase/server';
import { isDemoMode } from '@/lib/demo/mode';
import { demoActivity } from '@/lib/demo/store';

export async function listActivitiesForRole(profileId: string, role: string) {
  if (isDemoMode()) {
    return [
      {
        ...demoActivity,
        teacher_id: 'demo-teacher-1',
        created_at: new Date().toISOString()
      }
    ];
  }

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
