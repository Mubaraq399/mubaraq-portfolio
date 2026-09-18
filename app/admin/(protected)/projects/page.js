import { createClient } from '@/lib/supabaseServer';
import ProjectsTable from '@/components/ProjectsTable';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="h-m">Projects</h1>
        <a href="/admin/projects/new" className="btn btn-primary btn-sm">Add New Project</a>
      </div>
      <div className="card-panel">
        <ProjectsTable projects={projects || []} />
      </div>
    </div>
  );
}
