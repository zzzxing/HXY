'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/features/activities/activity-helpers';

export function EvidenceUpload({ activityId, siteId }: { activityId: string; siteId: string }) {
  const supabase = createClient();
  const [note, setNote] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  const upload = async () => {
    let publicUrl = '';
    if (file) {
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

    if (text.trim()) {
      await api('/api/evidences', {
        method: 'POST',
        body: JSON.stringify({ activity_id: activityId, site_id: siteId, evidence_type: 'text', text_content: text, note })
      });
    }

    setMsg('上传成功');
    setText('');
    setNote('');
    setFile(null);
  };

  return (
    <Card className="space-y-2">
      <h3 className="font-semibold">上传证据</h3>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <textarea className="w-full rounded border p-2" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="文字证据" />
      <input className="w-full rounded border p-2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="补充说明" />
      <Button onClick={upload}>提交证据</Button>
      {msg ? <p className="text-sm text-green-600">{msg}</p> : null}
    </Card>
  );
}
