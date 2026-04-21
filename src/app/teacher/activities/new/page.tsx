import { getSessionProfile } from '@/lib/auth/session';
import { NewActivityClient } from '@/features/activities/new-activity-client';

export default async function TeacherNewActivityPage() {
  await getSessionProfile('teacher');
  return <NewActivityClient />;
}
