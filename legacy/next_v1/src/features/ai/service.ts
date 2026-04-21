import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/ai/client';
import { isAIConfigured, isDemoMode } from '@/lib/demo/mode';
import { demoActivity, demoSites } from '@/lib/demo/store';

interface AskAIInput {
  activity_id: string;
  site_id?: string | null;
  phase: 'learn' | 'research' | 'visit';
  message: string;
  student_id: string;
}

function demoReply(input: AskAIInput) {
  return `当前未配置 AI 服务，已切换为演示模式。你可以先记录：1) 你观察到了什么；2) 这个现象可能说明什么；3) 你还想验证什么问题。你刚才的问题是：“${input.message}”。`;
}

export async function askLearningAI(input: AskAIInput) {
  if (isDemoMode() || !isAIConfigured()) {
    return demoReply(input);
  }

  try {
    const supabase = createClient();
    const { data: activity } = await supabase.from('activities').select('title,description').eq('id', input.activity_id).single();

    const site = input.site_id
      ? await supabase.from('activity_sites').select('name,intro,key_facts').eq('id', input.site_id).single().then((r) => r.data)
      : null;

    const act = activity ?? demoActivity;
    const siteInfo = site ?? demoSites.find((x) => x.id === input.site_id) ?? null;

    const systemPrompt = `你是“黄小游”，面向中小学生。\n活动:${act?.title ?? ''}\n活动简介:${act?.description ?? ''}\n点位:${siteInfo?.name ?? '无'}\n阶段:${input.phase}\n规则:1) 不直接给最终答案 2) 简短 3) 引导观察、比较、记录证据。`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input.message }
      ],
      temperature: 0.4
    });

    const reply = completion.choices[0]?.message?.content ?? demoReply(input);

    await supabase.from('ai_conversations').insert({
      activity_id: input.activity_id,
      site_id: input.site_id,
      student_id: input.student_id,
      phase: input.phase,
      user_message: input.message,
      ai_message: reply
    });

    return reply;
  } catch {
    return demoReply(input);
  }
}
