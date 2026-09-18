'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

const SUGGESTED_CATEGORIES = [
  'Embedded Systems',
  'Programming & Firmware',
  'IoT & Connectivity',
  'Electronics',
  'PCB Design',
  'Test & Workshop Tools'
];

export default function SkillsManager({ skills }) {
  const router = useRouter();
  const [category, setCategory] = useState(SUGGESTED_CATEGORIES[0]);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const grouped = {};
  skills.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: insertError } = await supabase.from('skills').insert({
      category,
      name: name.trim(),
      order_index: (grouped[category]?.length || 0)
    });
    setSaving(false);
    if (insertError) { setError(insertError.message); return; }
    setName('');
    router.refresh();
  }

  async function handleDelete(id) {
    const supabase = createClient();
    await supabase.from('skills').delete().eq('id', id);
    router.refresh();
  }

  return (
    <div>
      <div className="card-panel">
        <h3>Add Skill</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleAdd} className="form-row" style={{ alignItems: 'end' }}>
          <div className="field">
            <label>Category</label>
            <input list="skill-categories" value={category} onChange={(e) => setCategory(e.target.value)} />
            <datalist id="skill-categories">
              {SUGGESTED_CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="field">
            <label>Skill Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ESP32" />
          </div>
          <div className="field" style={{ marginBottom: 18 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding…' : 'Add'}</button>
          </div>
        </form>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">No skills yet — add your first one above.</div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div className="card-panel" key={cat}>
            <h3>{cat}</h3>
            <div className="tag-row" style={{ paddingTop: 0 }}>
              {items.map((s) => (
                <span className="chip" key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {s.name}
                  <button type="button" onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}>✕</button>
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
