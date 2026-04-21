import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/ai/client';

interface AskAIInput {
  activity_id: string;
  site_id?: string | null;
  phase: 'learn' | 'research' | 'visit';
  message: string;
  student_id: string;
}

export async function askLearningAI(input: AskAIInput) {
  const supabase = createClient();
  const { data: activity } = await supabase.from('activities').select('title,description').eq('id', input.activity_id).single();

  const site = input.site_id
    ? await supabase.from('activity_sites').select('name,intro,key_facts').eq('id', input.site_id).single().then((r) => r.data)
    : null;

  const systemPrompt = `你是“黄小游”，面向中小学生。\n活动:${activity?.title ?? ''}\n活动简介:${activity?.description ?? ''}\n点位:${site?.name ?? '无'}\n阶段:${input.phase}\n规则:1) 不直接给最终答案 2) 简短 3) 引导观察、比较、记录证据。`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input.message }
    ],
    temperature: 0.4
  });

  const reply = completion.choices[0]?.message?.content ?? '你可以先从“看到什么证据”开始描述，我再帮你一步步完善。';

  await supabase.from('ai_conversations').insert({
    activity_id: input.activity_id,
    site_id: input.site_id,
    student_id: input.student_id,
    phase: input.phase,
    user_message: input.message,
    ai_message: reply
  });

  return reply;
}
