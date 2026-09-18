'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function ExperienceManager({ entries }) {
  const router = useRouter();
  const [form, setForm] = useState({ role: '', organization: '', period: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.role.trim() || !form.organization.trim()) return;
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: insertError } = await supabase.from('experience').insert({ ...form, order_index: entries.length });
    setSaving(false);
    if (insertError) { setError(insertError.message); return; }
    setForm({ role: '', organization: '', period: '', description: '' });
    router.refresh();
  }

  async function handleDelete(id) {
    const supabase = createClient();
    await supabase.from('experience').delete().eq('id', id);
    router.refresh();
  }

  return (
    <div>
      <div className="card-panel">
        <h3>Add Experience Entry</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="field"><label>Role</label><input value={form.role} onChange={(e) => set('role', e.target.value)} /></div>
            <div className="field"><label>Organization</label><input value={form.organization} onChange={(e) => set('organization', e.target.value)} /></div>
          </div>
          <div className="field"><label>Period</label><input value={form.period} onChange={(e) => set('period', e.target.value)} placeholder="e.g. 2021–2023 · 2025" /></div>
          <div className="field"><label>Description</label><textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding…' : 'Add Entry'}</button>
        </form>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">No experience entries yet.</div>
      ) : (
        entries.map((e) => (
          <div className="card-panel" key={e.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div className="dim font-mono" style={{ fontSize: 12 }}>{e.period}</div>
              <div style={{ fontWeight: 600 }}>{e.role}</div>
              <div className="mute" style={{ fontSize: 13.5 }}>{e.organization}</div>
            </div>
            <button className="btn btn-danger btn-sm" style={{ height: 'fit-content' }} onClick={() => handleDelete(e.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
