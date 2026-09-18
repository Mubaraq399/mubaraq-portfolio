'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function EducationManager({ entries }) {
  const router = useRouter();
  const [form, setForm] = useState({ degree: '', institution: '', period: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.degree.trim() || !form.institution.trim()) return;
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: insertError } = await supabase.from('education').insert({ ...form, order_index: entries.length });
    setSaving(false);
    if (insertError) { setError(insertError.message); return; }
    setForm({ degree: '', institution: '', period: '' });
    router.refresh();
  }

  async function handleDelete(id) {
    const supabase = createClient();
    await supabase.from('education').delete().eq('id', id);
    router.refresh();
  }

  return (
    <div>
      <div className="card-panel">
        <h3>Add Education Entry</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleAdd}>
          <div className="field"><label>Degree</label><input value={form.degree} onChange={(e) => set('degree', e.target.value)} /></div>
          <div className="form-row">
            <div className="field"><label>Institution</label><input value={form.institution} onChange={(e) => set('institution', e.target.value)} /></div>
            <div className="field"><label>Period (optional)</label><input value={form.period} onChange={(e) => set('period', e.target.value)} /></div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding…' : 'Add Entry'}</button>
        </form>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">No education entries yet.</div>
      ) : (
        entries.map((e) => (
          <div className="card-panel" key={e.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{e.degree}</div>
              <div className="mute" style={{ fontSize: 13.5 }}>{e.institution}{e.period ? ` · ${e.period}` : ''}</div>
            </div>
            <button className="btn btn-danger btn-sm" style={{ height: 'fit-content' }} onClick={() => handleDelete(e.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
