'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import ImageUploader from './ImageUploader';

const CATEGORIES = ['Embedded Systems', 'IoT', 'Electronics', 'PCB Design', 'Automation', 'Power Electronics'];
const BUCKET = 'project-media';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProjectForm({ mode, project, images: initialImages }) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [images, setImages] = useState(initialImages || []);
  const [coverUploading, setCoverUploading] = useState(false);

  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    short_description: project?.short_description || '',
    description: project?.description || '',
    category: project?.category || CATEGORIES[0],
    project_date: project?.project_date || '',
    status: project?.status || 'draft',
    problem: project?.problem || '',
    objective: project?.objective || '',
    role: project?.role || '',
    hardware: project?.hardware || '',
    software: project?.software || '',
    how_it_works: project?.how_it_works || '',
    workflow: project?.workflow || '',
    testing: project?.testing || '',
    results: project?.results || '',
    lessons: project?.lessons || '',
    technologies: project?.technologies || [],
    github_url: project?.github_url || '',
    demo_url: project?.demo_url || '',
    cover_image: project?.cover_image || '',
    youtube_url: project?.youtube_url || '',
    vimeo_url: project?.vimeo_url || ''
  });
  const [techInput, setTechInput] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleTitleChange(value) {
    set('title', value);
    if (!slugTouched) set('slug', slugify(value));
  }

  function addTech() {
    const val = techInput.trim();
    if (!val) return;
    if (!form.technologies.includes(val)) set('technologies', [...form.technologies, val]);
    setTechInput('');
  }

  function removeTech(t) {
    set('technologies', form.technologies.filter((x) => x !== t));
  }

  async function refreshImages(projectId) {
    const supabase = createClient();
    const { data } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });
    setImages(data || []);
  }

  async function handleCoverUpload(file) {
    const id = project?.id;
    if (!id) {
      setError('Save the project once before uploading a cover image.');
      return;
    }
    setCoverUploading(true);
    const supabase = createClient();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `${id}/cover/${Date.now()}-${cleanName}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
    if (uploadError) {
      setError(uploadError.message);
      setCoverUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const { error: updateError } = await supabase.from('projects').update({ cover_image: publicUrlData.publicUrl }).eq('id', id);
    setCoverUploading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    set('cover_image', publicUrlData.publicUrl);
    router.refresh();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.');
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...form,
      project_date: form.project_date || null
    };

    if (mode === 'new') {
      const { data, error: insertError } = await supabase.from('projects').insert(payload).select().single();
      setSaving(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
      router.push(`/admin/projects/${data.id}/edit?created=1`);
      router.refresh();
      return;
    }

    const { error: updateError } = await supabase.from('projects').update(payload).eq('id', project.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessage('Project saved.');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-ok">{message}</div>}

      {/* Basic information */}
      <div className="card-panel">
        <h3>Basic Information</h3>
        <div className="field">
          <label>Project Title</label>
          <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div className="field">
          <label>Slug</label>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', slugify(e.target.value));
            }}
            required
          />
          <p className="field-hint">Public URL: /projects/{form.slug || 'your-project-slug'}</p>
        </div>
        <div className="field">
          <label>Short Description</label>
          <textarea rows={2} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
        </div>
        <div className="field">
          <label>Full Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Project Date</label>
            <input type="date" value={form.project_date || ''} onChange={(e) => set('project_date', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Project content */}
      <div className="card-panel">
        <h3>Project Content</h3>
        <div className="field"><label>Problem</label><textarea rows={2} value={form.problem} onChange={(e) => set('problem', e.target.value)} /></div>
        <div className="field"><label>Objective</label><textarea rows={2} value={form.objective} onChange={(e) => set('objective', e.target.value)} /></div>
        <div className="field"><label>My Role</label><textarea rows={2} value={form.role} onChange={(e) => set('role', e.target.value)} /></div>
        <div className="form-row">
          <div className="field"><label>Hardware</label><textarea rows={3} value={form.hardware} onChange={(e) => set('hardware', e.target.value)} /></div>
          <div className="field"><label>Software</label><textarea rows={3} value={form.software} onChange={(e) => set('software', e.target.value)} /></div>
        </div>
        <div className="field"><label>How It Works</label><textarea rows={3} value={form.how_it_works} onChange={(e) => set('how_it_works', e.target.value)} /></div>
        <div className="field"><label>Development Process</label><textarea rows={3} value={form.workflow} onChange={(e) => set('workflow', e.target.value)} /></div>
        <div className="field"><label>Testing</label><textarea rows={3} value={form.testing} onChange={(e) => set('testing', e.target.value)} /></div>
        <div className="field"><label>Results</label><textarea rows={2} value={form.results} onChange={(e) => set('results', e.target.value)} /></div>
        <div className="field"><label>Lessons Learned</label><textarea rows={2} value={form.lessons} onChange={(e) => set('lessons', e.target.value)} /></div>
      </div>

      {/* Technologies */}
      <div className="card-panel">
        <h3>Technologies</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <input
            value={techInput}
            placeholder="e.g. ESP32"
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={addTech}>Add</button>
        </div>
        <div className="tag-row" style={{ paddingTop: 0 }}>
          {form.technologies.map((t) => (
            <span className="chip" key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {t}
              <button type="button" onClick={() => removeTech(t)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}>✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* Media */}
      <div className="card-panel">
        <h3>Media Upload</h3>

        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--text-mute)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
            Cover Image
          </label>
          <div className="thumb-grid">
            {form.cover_image && (
              <div className="thumb">
                <img src={form.cover_image} alt="" />
              </div>
            )}
            <label
              className="thumb"
              style={{ width: 110, height: 80, border: '1px dashed var(--border-strong)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: project?.id ? 'pointer' : 'not-allowed', fontSize: 20, color: 'var(--text-dim)' }}
            >
              {coverUploading ? '…' : '+'}
              <input type="file" accept="image/*" disabled={!project?.id || coverUploading} style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
            </label>
          </div>
          {!project?.id && <p className="field-hint">Save the project once to enable uploads here.</p>}
        </div>

        <ImageUploader projectId={project?.id} kind="gallery" label="Project Gallery" images={images.filter((i) => i.kind === 'gallery')} onChange={() => refreshImages(project.id)} />
        <ImageUploader projectId={project?.id} kind="schematic" label="Circuit / Schematic Diagram" images={images.filter((i) => i.kind === 'schematic')} onChange={() => refreshImages(project.id)} />
        <ImageUploader projectId={project?.id} kind="pcb" label="PCB Image" images={images.filter((i) => i.kind === 'pcb')} onChange={() => refreshImages(project.id)} />
        <ImageUploader projectId={project?.id} kind="prototype" label="Prototype Image" images={images.filter((i) => i.kind === 'prototype')} onChange={() => refreshImages(project.id)} />
        <ImageUploader projectId={project?.id} kind="final" label="Final Product Image" images={images.filter((i) => i.kind === 'final')} onChange={() => refreshImages(project.id)} />
      </div>

      {/* Video */}
      <div className="card-panel">
        <h3>Video</h3>
        <div className="form-row">
          <div className="field"><label>YouTube URL</label><input value={form.youtube_url} onChange={(e) => set('youtube_url', e.target.value)} /></div>
          <div className="field"><label>Vimeo URL</label><input value={form.vimeo_url} onChange={(e) => set('vimeo_url', e.target.value)} /></div>
        </div>
        <p className="field-hint">For an uploaded demonstration video, add it to the Project Gallery above and link it here once hosted, or store it in your own video host and paste the URL.</p>
      </div>

      {/* Links */}
      <div className="card-panel">
        <h3>Links</h3>
        <div className="field"><label>GitHub Repository URL</label><input value={form.github_url} onChange={(e) => set('github_url', e.target.value)} /></div>
        <div className="field"><label>Live Demo URL (optional)</label><input value={form.demo_url} onChange={(e) => set('demo_url', e.target.value)} /></div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : mode === 'new' ? 'Create Project' : 'Save Changes'}
        </button>
        <a href="/admin/projects" className="btn btn-ghost">Cancel</a>
      </div>
    </form>
  );
}
