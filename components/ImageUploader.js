'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

const BUCKET = 'project-media';

export default function ImageUploader({ projectId, kind, label, images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFiles(fileList) {
    if (!projectId) {
      setError('Save the project once before uploading images.');
      return;
    }
    setError('');
    setUploading(true);
    const supabase = createClient();
    const files = Array.from(fileList);

    for (const [index, file] of files.entries()) {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const path = `${projectId}/${kind}/${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
      if (uploadError) {
        setError(uploadError.message);
        continue;
      }
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { error: insertError } = await supabase.from('project_images').insert({
        project_id: projectId,
        url: publicUrlData.publicUrl,
        kind,
        order_index: images.length + index
      });
      if (insertError) setError(insertError.message);
    }

    setUploading(false);
    if (onChange) onChange();
  }

  async function handleDelete(img) {
    const supabase = createClient();
    await supabase.from('project_images').delete().eq('id', img.id);
    onChange();
  }

  async function handleReorder(img, direction) {
    const idx = images.findIndex((i) => i.id === img.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= images.length) return;
    const other = images[swapIdx];

    const supabase = createClient();
    await Promise.all([
      supabase.from('project_images').update({ order_index: other.order_index }).eq('id', img.id),
      supabase.from('project_images').update({ order_index: img.order_index }).eq('id', other.id)
    ]);
    onChange();
  }

  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: 'block', fontSize: 13, color: 'var(--text-mute)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      <div className="thumb-grid">
        {images.map((img, i) => (
          <div className="thumb" key={img.id}>
            <img src={img.url} alt="" />
            <div className="thumb-actions">
              <button type="button" onClick={() => handleReorder(img, 'up')} disabled={i === 0} title="Move left">←</button>
              <button type="button" onClick={() => handleReorder(img, 'down')} disabled={i === images.length - 1} title="Move right">→</button>
              <button type="button" onClick={() => handleDelete(img)} title="Delete" style={{ color: 'var(--danger)' }}>✕</button>
            </div>
          </div>
        ))}
        <label
          className="thumb"
          style={{
            width: 110,
            height: 80,
            border: '1px dashed var(--border-strong)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: projectId ? 'pointer' : 'not-allowed',
            fontSize: 20,
            color: 'var(--text-dim)'
          }}
        >
          {uploading ? '…' : '+'}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={!projectId || uploading}
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="form-note" style={{ color: 'var(--danger)' }}>{error}</p>}
      {!projectId && <p className="field-hint">Save the project once to enable uploads here.</p>}
    </div>
  );
}
