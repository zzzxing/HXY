import { fail, ok, requireProfile } from '../../_utils';
import { demoCases } from '@/lib/demo/store';

export async function GET() {
  const { profile } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可查看', 403);
  return ok(demoCases);
}

export async function POST(req: Request) {
  const { profile } = await requireProfile();
  if (profile.role !== 'teacher') return fail('仅教师可创建', 403);
  const body = await req.json();
  const item = {
    id: `case-${Date.now()}`,
    title: body.title || '未命名案例',
    cover_image: body.cover_image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80',
    summary: body.summary || '',
    status: 'draft',
    route_id: `route-${Date.now()}`,
    published_class_ids: [],
    version: 1,
    from_template_case_id: body.from_template_case_id || null
  };
  demoCases.unshift(item as any);
  return ok(item);
}
