'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

export function ChatBox({ title = 'AI 导学', activityId, siteId, phase }: { title?: string; activityId: string; siteId?: string; phase: 'learn' | 'research' | 'visit' }) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const ask = async () => {
    if (!message.trim()) return;
    try {
      const data = await api<{ reply: string }>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ activity_id: activityId, site_id: siteId ?? null, phase, message })
      });
      setReply(data.reply);
    } catch {
      setReply('先从“我看到了什么证据”开始描述，我来陪你继续推理。');
    }
  };

  return (
    <Card className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <textarea className="w-full rounded border p-2" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="输入你的问题或观察" />
      <Button onClick={ask}>发送</Button>
      {reply ? <p className="rounded bg-slate-50 p-2 text-sm">{reply}</p> : null}
    </Card>
  );
}
