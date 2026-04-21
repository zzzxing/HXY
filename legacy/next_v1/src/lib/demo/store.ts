import { Profile, UserRole } from '@/types/domain';

export const demoProfiles: Record<UserRole, Profile> = {
  student: { id: 'demo-student-1', name: '演示学生-小雨', role: 'student', school_id: null, class_id: null, student_no: 'S001' },
  teacher: { id: 'demo-teacher-1', name: '演示教师-陈老师', role: 'teacher', school_id: null, class_id: null, student_no: null },
  admin: { id: 'demo-admin-1', name: '演示管理员', role: 'admin', school_id: null, class_id: null, student_no: null }
};

export const demoScenic = {
  id: 'huangshi-park',
  title: '黄石国家矿山公园云游',
  subtitle: '工业文明、矿冶记忆与生态转型的课堂云游案例',
  banner: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80'
};

export const demoActivity = {
  id: 'demo-activity-1',
  title: '黄石国家矿山公园云游',
  description: '通过 5 个点位完成“观察—提问—证据—解释—结论”的探究链路。',
  theme: '黄石工业文化与城市转型'
};

export const demoSites = [
  {
    id: 'site-1', activity_id: 'demo-activity-1', order_index: 1, name: '序厅：黄石矿冶历史总览',
    intro: '建立历史时间线与核心概念，理解黄石矿冶文明发展脉络。',
    key_facts: '黄石是中国近代矿冶工业的重要发源地之一。',
    problem_chain: [{ content: '工业发展如何改变城市空间结构？' }, { content: '矿冶历史如何影响当代城市气质？' }],
    evidence_checklist: ['记录一条关键时间线', '标注一项工业里程碑'],
    cover_image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80'],
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audio_url: 'https://www.w3schools.com/html/horse.mp3',
    ai_context: '重点讲解黄石矿冶历史、产业转型与工业文化价值。'
  },
  {
    id: 'site-2', activity_id: 'demo-activity-1', order_index: 2, name: '露天矿坑观景台',
    intro: '观察矿坑形态、采掘方式与地质特征。',
    key_facts: '露天采矿强调分层开采与安全边坡设计。',
    problem_chain: [{ content: '矿坑形态能反映哪些采掘逻辑？' }], evidence_checklist: ['画出矿坑分层示意', '记录一条安全观察要点'],
    cover_image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80'],
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audio_url: 'https://www.w3schools.com/html/horse.mp3',
    ai_context: '聚焦露天矿坑结构、设备与地质观察方法。'
  },
  {
    id: 'site-3', activity_id: 'demo-activity-1', order_index: 3, name: '矿车与采矿机械区',
    intro: '认识矿车、传送、提升等机械系统。', key_facts: '机械化提升了采矿效率与安全性。',
    problem_chain: [{ content: '矿车系统如何实现连续运输？' }], evidence_checklist: ['拍摄一张机械细节图', '解释一条动力传输路径'],
    cover_image: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80'],
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audio_url: 'https://www.w3schools.com/html/horse.mp3',
    ai_context: '强调机械系统与工程思维。'
  },
  {
    id: 'site-4', activity_id: 'demo-activity-1', order_index: 4, name: '工业精神与工人故事展区',
    intro: '理解工匠精神、劳动协作与社会价值。', key_facts: '工人群体塑造了工业城市的共同记忆。',
    problem_chain: [{ content: '工业精神在今天还能如何体现？' }], evidence_checklist: ['记录一段工人故事', '提炼一个价值关键词'],
    cover_image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80'],
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audio_url: 'https://www.w3schools.com/html/horse.mp3',
    ai_context: '强调人物叙事与价值观引导。'
  },
  {
    id: 'site-5', activity_id: 'demo-activity-1', order_index: 5, name: '生态修复与城市转型展区',
    intro: '观察矿区生态修复策略与城市更新成果。', key_facts: '生态修复是资源型城市可持续发展的关键。',
    problem_chain: [{ content: '如何平衡工业记忆保护与生态治理？' }], evidence_checklist: ['找出1项修复措施', '提出1条城市转型建议'],
    cover_image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80', 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&q=80'],
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audio_url: 'https://www.w3schools.com/html/horse.mp3',
    ai_context: '强调生态与城市治理探究。'
  }
];

export const demoTasks = [
  { id: 'task-1', activity_id: 'demo-activity-1', phase: 'learn', sort_order: 1, title: '时间线速记', description: '在序厅整理 3 个关键历史节点。', required: true, site_id: 'site-1' },
  { id: 'task-2', activity_id: 'demo-activity-1', phase: 'visit', sort_order: 2, title: '矿坑结构观察', description: '完成矿坑分层示意图并说明功能。', required: true, site_id: 'site-2' },
  { id: 'task-3', activity_id: 'demo-activity-1', phase: 'visit', sort_order: 3, title: '机械系统拆解', description: '解释矿车运输链路的 2 个关键环节。', required: true, site_id: 'site-3' },
  { id: 'task-4', activity_id: 'demo-activity-1', phase: 'research', sort_order: 4, title: '工人故事采访卡', description: '记录一段工人故事并提炼精神关键词。', required: true, site_id: 'site-4' },
  { id: 'task-5', activity_id: 'demo-activity-1', phase: 'research', sort_order: 5, title: '城市转型提案', description: '围绕生态修复提交 1 条转型建议。', required: true, site_id: 'site-5' }
];

export const classWall = {
  highlights: [
    { id: 'w1', student: '刘同学', title: '矿坑分层图绘制优秀', likes: 18 },
    { id: 'w2', student: '张同学', title: '工人故事口述整理完整', likes: 15 }
  ],
  hotQuestions: ['露天采矿为何常用台阶式开采？', '工业遗产保护与开发如何平衡？'],
  groupProgress: [{ group: 'A组', rate: 92 }, { group: 'B组', rate: 78 }, { group: 'C组', rate: 85 }]
};

export let demoState = {
  questions: [
    { id: 'q-1', activity_id: 'demo-activity-1', student_id: 'demo-student-1', phase: 'learn', content: '黄石矿冶历史最关键的转折点是什么？' }
  ],
  evidences: [
    { id: 'e-1', activity_id: 'demo-activity-1', site_id: 'site-2', student_id: 'demo-student-1', evidence_type: 'text', text_content: '矿坑呈阶梯状，便于分层开采和运输。', note: '观察记录', created_at: new Date().toISOString() }
  ],
  progresses: [
    { id: 'p-1', activity_id: 'demo-activity-1', site_id: 'site-1', student_id: 'demo-student-1', status: 'completed', note: '完成序厅任务', completed_at: new Date().toISOString() }
  ],
  portfolios: [
    { id: 'pf-1', activity_id: 'demo-activity-1', student_id: 'demo-student-1', summary: '已完成 1 个点位，收集证据 1 条，正在推进任务链。', teacher_score: 90, teacher_comment: '结构清晰，建议补充图像证据。', status: 'reviewed', updated_at: new Date().toISOString() }
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
