'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function MessagesTable({ messages }) {
  const router = useRouter();

  async function toggleRead(m) {
    const supabase = createClient();
    await supabase.from('messages').update({ read: !m.read }).eq('id', m.id);
    router.refresh();
  }

  async function handleDelete(m) {
    if (!confirm('Delete this message?')) return;
    const supabase = createClient();
    await supabase.from('messages').delete().eq('id', m.id);
    router.refresh();
  }

  if (messages.length === 0) {
    return <div className="empty-state">No messages yet — they&apos;ll appear here when someone uses the contact form.</div>;
  }

  return (
    <div>
      {messages.map((m) => (
        <div className="card-panel" key={m.id} style={{ opacity: m.read ? 0.7 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{m.name} {!m.read && <span className="status-tag published" style={{ marginLeft: 8 }}>new</span>}</div>
              <a className="dim font-mono" style={{ fontSize: 12.5 }} href={`mailto:${m.email}`}>{m.email}</a>
            </div>
            <div className="dim font-mono" style={{ fontSize: 12 }}>{new Date(m.created_at).toLocaleString()}</div>
          </div>
          <p className="mute" style={{ fontSize: 14.5, whiteSpace: 'pre-line' }}>{m.message}</p>
          <div className="row-actions" style={{ marginTop: 14 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => toggleRead(m)}>{m.read ? 'Mark unread' : 'Mark read'}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
