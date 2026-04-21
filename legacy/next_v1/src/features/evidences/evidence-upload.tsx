'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_FORCE_DEMO_MODE === '1';

export function EvidenceUpload({ activityId, siteId }: { activityId: string; siteId: string }) {
  const [note, setNote] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  const upload = async () => {
    let publicUrl = '';
    if (file) {
      if (isDemoMode) {
        publicUrl = `demo://local-file/${encodeURIComponent(file.name)}`;
        await api('/api/evidences', {
          method: 'POST',
          body: JSON.stringify({ activity_id: activityId, site_id: siteId, evidence_type: 'image', file_url: publicUrl, note })
        });
      } else {
        const supabase = createClient();
        const sign = await api<{ bucket: string; path: string }>('/api/uploads/sign', {
          method: 'POST',
          body: JSON.stringify({ activity_id: activityId, file_name: file.name })
        });
        const { error } = await supabase.storage.from(sign.bucket).upload(sign.path, file, { upsert: true });
        if (error) return setMsg(error.message);
        publicUrl = supabase.storage.from(sign.bucket).getPublicUrl(sign.path).data.publicUrl;
        await api('/api/evidences', {
          method: 'POST',
          body: JSON.stringify({ activity_id: activityId, site_id: siteId, evidence_type: 'image', file_url: publicUrl, note })
        });
      }
    }

    if (text.trim()) {
      await api('/api/evidences', {
        method: 'POST',
        body: JSON.stringify({ activity_id: activityId, site_id: siteId, evidence_type: 'text', text_content: text, note })
      });
    }

    setMsg(isDemoMode ? '已保存到本地演示数据（不会同步云端）' : '上传成功');
    setText('');
    setNote('');
    setFile(null);
  };

  return (
    <Card className="space-y-2">
      <h3 className="font-semibold">证据背包上传</h3>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <textarea className="w-full rounded border p-2" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="文字证据" />
      <input className="w-full rounded border p-2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="补充说明" />
      <Button onClick={upload}>提交证据</Button>
      {msg ? <p className="text-sm text-green-600">{msg}</p> : null}
    </Card>
  );
}
