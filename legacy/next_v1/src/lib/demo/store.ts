import { Profile, UserRole } from '@/types/domain';

export const demoProfiles: Record<UserRole, Profile> = {
  student: { id: 'demo-student-1', name: '演示学生-小雨', role: 'student', school_id: null, class_id: null, student_no: 'S001' },
  teacher: { id: 'demo-teacher-1', name: '演示教师-陈老师', role: 'teacher', school_id: null, class_id: null, student_no: null },
  admin: { id: 'demo-admin-1', name: '演示管理员', role: 'admin', school_id: null, class_id: null, student_no: null }
};

export const demoActivity = {
  id: 'demo-activity-1',
  title: '钢铁小镇课堂云游',
  description: '围绕工业遗产进行路线探索、证据采集与学习档案生成。',
  theme: '工业遗产与城市记忆'
};

export const demoSites = [
  { id: 'site-1', activity_id: 'demo-activity-1', order_index: 1, name: '老高炉观景台', intro: '观察高炉结构与功能分区。', key_facts: '高炉是炼铁核心设施。', problem_chain: [{ content: '高炉外形为什么这么高？' }], evidence_checklist: ['拍一张结构照片', '写一句功能解释'] },
  { id: 'site-2', activity_id: 'demo-activity-1', order_index: 2, name: '工人文化馆', intro: '了解工人生活与社区文化。', key_facts: '工业社区形成了独特文化。', problem_chain: [{ content: '工人社区和普通社区有什么不同？' }], evidence_checklist: ['记录一件老物件', '采访语句1条'] },
  { id: 'site-3', activity_id: 'demo-activity-1', order_index: 3, name: '铁轨记忆长廊', intro: '追踪运输系统与城市发展关系。', key_facts: '运输网络决定资源流动效率。', problem_chain: [{ content: '铁轨路线如何影响城市布局？' }], evidence_checklist: ['画一条简易路线图', '写出一个因果关系'] }
];

export const demoTasks = [
  { id: 'task-1', activity_id: 'demo-activity-1', phase: 'research', sort_order: 1, title: '查找老照片', description: '找1张老工业区照片并说明变化。', required: true },
  { id: 'task-2', activity_id: 'demo-activity-1', phase: 'research', sort_order: 2, title: '家庭访谈', description: '采访1位长辈，记录1段工业记忆。', required: true }
];

export const demoState = {
  questions: [
    { id: 'q-1', activity_id: 'demo-activity-1', student_id: 'demo-student-1', phase: 'learn', content: '为什么工业遗产值得保护？' },
    { id: 'q-2', activity_id: 'demo-activity-1', student_id: 'demo-student-1', phase: 'research', content: '老照片能反映哪些城市变化？' }
  ],
  evidences: [
    { id: 'e-1', activity_id: 'demo-activity-1', site_id: 'site-1', student_id: 'demo-student-1', evidence_type: 'text', text_content: '高炉周边有原料传送设备。', note: '现场观察', created_at: new Date().toISOString() }
  ],
  progresses: [
    { id: 'p-1', activity_id: 'demo-activity-1', site_id: 'site-1', student_id: 'demo-student-1', status: 'completed', note: '已完成打卡', completed_at: new Date().toISOString() }
  ],
  portfolios: [
    { id: 'pf-1', activity_id: 'demo-activity-1', student_id: 'demo-student-1', summary: '提出问题2条，提交证据1条，完成点位1个。', teacher_score: 88, teacher_comment: '观察细致，建议补充对比证据。', status: 'reviewed', updated_at: new Date().toISOString() }
  ]
};

export function getDemoProfile(role: UserRole = 'student') {
  return demoProfiles[role];
}

export function getDemoRoleFromCookie(cookieHeader?: string | null): UserRole {
  if (!cookieHeader) return 'student';
  const raw = cookieHeader.split(';').map((x) => x.trim()).find((x) => x.startsWith('demo_role='));
  const role = raw?.split('=')[1] as UserRole | undefined;
  if (role === 'student' || role === 'teacher' || role === 'admin') return role;
  return 'student';
}
