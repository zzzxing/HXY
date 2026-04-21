import { redirect } from 'next/navigation';
import { isDemoMode } from '@/lib/demo/mode';

export default function HomePage() {
  if (isDemoMode()) {
    redirect('/student/activities');
  }
  redirect('/login');
}
