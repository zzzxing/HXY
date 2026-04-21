import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/ai/client';
import { isAIConfigured, isDemoMode } from '@/lib/demo/mode';
import { demoCases, demoSites } from '@/lib/demo/store';

interface AskAIInput {
  activity_id: string;
  site_id?: string | null;
  phase: 'learn' | 'research' | 'visit';
  message: string;
  student_id: string;
}

function demoReply(input: AskAIInput) {
  return `请先从资源中找出可用证据，再按“观察-解释-结论”结构表达。你提到的问题是：${input.message}`;
}

export async function askLearningAI(input: AskAIInput) {
  if (isDemoMode() || !isAIConfigured()) return demoReply(input);

  try {
    const supabase = createClient();
    const { data: activity } = await supabase.from('activities').select('title,description').eq('id', input.activity_id).single();
    const site = input.site_id ? await supabase.from('activity_sites').select('name,intro,key_facts').eq('id', input.site_id).single().then((r) => r.data) : null;

    const act = activity ?? { title: demoCases[0].title, description: demoCases[0].summary };
    const siteInfo = site ?? demoSites.find((x) => x.id === input.site_id) ?? null;

    const systemPrompt = `你是课堂AI助教。活动:${act.title}\n点位:${siteInfo?.name ?? '无'}\n阶段:${input.phase}\n规则:引导学生基于证据推理，不直接代写答案。`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: input.message }],
      temperature: 0.4
    });

    return completion.choices[0]?.message?.content ?? demoReply(input);
  } catch {
    return demoReply(input);
  }
}
