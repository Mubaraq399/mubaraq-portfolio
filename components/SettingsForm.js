'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function SettingsForm({ settings }) {
  const router = useRouter();
  const [form, setForm] = useState({
    email: settings?.email || '',
    linkedin_url: settings?.linkedin_url || '',
    github_url: settings?.github_url || '',
    cv_url: settings?.cv_url || '',
    status_message: settings?.status_message || 'Open to Engineering Opportunities'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    const supabase = createClient();
    const { error: updateError } = await supabase.from('settings').update(form).eq('id', 1);
    setSaving(false);
    if (updateError) { setError(updateError.message); return; }
    setMessage('Settings saved.');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel">
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-ok">{message}</div>}
      <div className="field"><label>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
      <div className="field"><label>LinkedIn URL</label><input value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} /></div>
      <div className="field"><label>GitHub URL</label><input value={form.github_url} onChange={(e) => set('github_url', e.target.value)} /></div>
      <div className="field"><label>CV File/Link</label><input value={form.cv_url} onChange={(e) => set('cv_url', e.target.value)} /></div>
      <div className="field"><label>Hero Status Message</label><input value={form.status_message} onChange={(e) => set('status_message', e.target.value)} /></div>
      <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
    </form>
  );
}
