'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

export function ChatBox({ activityId, siteId, phase }: { activityId: string; siteId?: string; phase: 'learn' | 'research' | 'visit' }) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const ask = async () => {
    if (!message.trim()) return;
    const data = await api<{ reply: string }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ activity_id: activityId, site_id: siteId ?? null, phase, message })
    });
    setReply(data.reply);
  };

  return (
    <Card className="space-y-2">
      <h3 className="font-semibold">AI 导学问答</h3>
      <textarea className="w-full rounded border p-2" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="输入你想问的问题" />
      <Button onClick={ask}>提问</Button>
      {reply ? <p className="rounded bg-slate-50 p-2 text-sm">{reply}</p> : null}
    </Card>
  );
}
