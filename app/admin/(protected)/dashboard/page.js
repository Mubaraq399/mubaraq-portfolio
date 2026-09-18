import { createClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();

  const [{ count: total }, { count: published }, { count: drafts }, { count: skillsCount }, { data: recent }] =
    await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 24 }}>Overview</h1>

      <div className="stat-grid">
        <div className="stat-box"><div className="num">{total ?? 0}</div><div className="label">Total Projects</div></div>
        <div className="stat-box"><div className="num">{published ?? 0}</div><div className="label">Published Projects</div></div>
        <div className="stat-box"><div className="num">{drafts ?? 0}</div><div className="label">Draft Projects</div></div>
        <div className="stat-box"><div className="num">{skillsCount ?? 0}</div><div className="label">Total Skills</div></div>
      </div>

      <div className="card-panel">
        <h3>Recent Projects</h3>
        {recent && recent.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr><th>Project</th><th>Category</th><th>Status</th><th>Updated</th></tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td><span className={`status-tag ${p.status}`}>{p.status}</span></td>
                  <td className="dim">{new Date(p.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mute">No projects yet — create your first one from the Projects tab.</p>
        )}
      </div>
    </div>
  );
}
