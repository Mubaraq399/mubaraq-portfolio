import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import ProjectForm from '@/components/ProjectForm';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params, searchParams }) {
  const supabase = createClient();
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.id).maybeSingle();
  if (!project) notFound();

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('order_index', { ascending: true });

  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 8 }}>Edit Project</h1>
      <p className="mute" style={{ marginBottom: 24, fontSize: 14 }}>{project.title}</p>
      {searchParams?.created && (
        <div className="alert alert-ok">Project created — now add media, links, and publish when ready.</div>
      )}
      <ProjectForm mode="edit" project={project} images={images || []} />
    </div>
  );
}
