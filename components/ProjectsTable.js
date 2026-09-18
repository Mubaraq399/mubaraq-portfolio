'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function ProjectsTable({ projects }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);

  async function togglePublish(project) {
    setBusyId(project.id);
    const supabase = createClient();
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('projects').update({ status: nextStatus }).eq('id', project.id);
    setBusyId(null);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  async function handleDelete(project) {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setBusyId(project.id);
    const supabase = createClient();
    const { error } = await supabase.from('projects').delete().eq('id', project.id);
    setBusyId(null);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  if (projects.length === 0) {
    return <div className="empty-state">No projects yet — click &quot;Add New Project&quot; to create one.</div>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Project Name</th>
          <th>Category</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id}>
            <td>
              {p.cover_image ? (
                <img src={p.cover_image} alt="" className="table-thumb" />
              ) : (
                <div className="table-thumb" />
              )}
            </td>
            <td>{p.title}</td>
            <td className="dim">{p.category}</td>
            <td><span className={`status-tag ${p.status}`}>{p.status}</span></td>
            <td className="dim">{p.project_date ? new Date(p.project_date).toLocaleDateString() : '—'}</td>
            <td>
              <div className="row-actions">
                <a href={`/admin/projects/${p.id}/edit`} className="btn btn-ghost btn-sm">Edit</a>
                <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">Preview</a>
                <button className="btn btn-ghost btn-sm" disabled={busyId === p.id} onClick={() => togglePublish(p)}>
                  {p.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button className="btn btn-danger btn-sm" disabled={busyId === p.id} onClick={() => handleDelete(p)}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
