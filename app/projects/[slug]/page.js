import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

async function getProject(slug) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!project) return { project: null, images: [], settings: {} };

  const [{ data: images }, { data: settingsRow }] = await Promise.all([
    supabase.from('project_images').select('*').eq('project_id', project.id).order('order_index', { ascending: true }),
    supabase.from('settings').select('*').eq('id', 1).maybeSingle()
  ]);

  return { project, images: images || [], settings: settingsRow || {} };
}

export async function generateMetadata({ params }) {
  const { project } = await getProject(params.slug);
  if (!project) return { title: 'Project not found — Mubaraq Olalekan' };
  return {
    title: `${project.title} — Mubaraq Olalekan`,
    description: project.short_description
  };
}

function imagesOfKind(images, kind) {
  return images.filter((i) => i.kind === kind);
}

export default async function ProjectDetailPage({ params }) {
  const { project, images, settings } = await getProject(params.slug);
  if (!project) notFound();

  const gallery = imagesOfKind(images, 'gallery');
  const pcb = imagesOfKind(images, 'pcb');
  const schematic = imagesOfKind(images, 'schematic');
  const prototype = imagesOfKind(images, 'prototype');
  const final = imagesOfKind(images, 'final');
  const allVisuals = [...gallery, ...pcb, ...schematic, ...prototype, ...final];

  return (
    <>
      <SiteNav />
      <section className="detail-hero">
        <div className="wrap">
          <a href="/#projects" className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
            ← Back to Projects
          </a>
          <div className="card-highlight" style={{ marginBottom: 10 }}>{project.category}</div>
          <h1 className="h-l">{project.title}</h1>
          {project.project_date && (
            <p className="dim font-mono" style={{ fontSize: 12.5, marginTop: 10 }}>
              {new Date(project.project_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </p>
          )}

          {project.cover_image && (
            <img
              src={project.cover_image}
              alt={project.title}
              style={{ width: '100%', borderRadius: 16, border: '1px solid var(--border)', marginTop: 28, aspectRatio: '16/8', objectFit: 'cover' }}
            />
          )}

          <div className="detail-gallery">
            {allVisuals.length > 0
              ? allVisuals.map((img) => <img key={img.id} src={img.url} alt={project.title} />)
              : (
                <>
                  <div className="gallery-slot">[Add project photo]</div>
                  <div className="gallery-slot">[Add PCB image here]</div>
                  <div className="gallery-slot">[Add circuit/schematic image here]</div>
                </>
              )}
          </div>

          <div className="detail-block">
            <h4>Overview</h4>
            <p>{project.description || project.short_description}</p>
          </div>

          <div className="detail-2col">
            <div className="detail-block" style={{ marginTop: 0 }}>
              <h4>Problem Statement</h4>
              <p>{project.problem || '[Add problem statement — what issue this project solves]'}</p>
            </div>
            <div className="detail-block" style={{ marginTop: 0 }}>
              <h4>Objective</h4>
              <p>{project.objective || '[Add project objective]'}</p>
            </div>
          </div>

          <div className="detail-block">
            <h4>My Role</h4>
            <p>{project.role || '[Add your role and contributions]'}</p>
          </div>

          <div className="detail-2col">
            <div className="detail-block" style={{ marginTop: 0 }}>
              <h4>Hardware Used</h4>
              <p>{project.hardware || '[Add hardware used]'}</p>
            </div>
            <div className="detail-block" style={{ marginTop: 0 }}>
              <h4>Software Used</h4>
              <p>{project.software || '[Add software/tools used]'}</p>
            </div>
          </div>

          <div className="detail-block">
            <h4>How It Works</h4>
            <p>{project.how_it_works || '[Add explanation of how the system works]'}</p>
          </div>
          <div className="detail-block">
            <h4>Development Process</h4>
            <p>{project.workflow || '[Add development process notes]'}</p>
          </div>
          <div className="detail-block">
            <h4>Testing</h4>
            <p>{project.testing || '[Add testing details and observations]'}</p>
          </div>
          <div className="detail-block">
            <h4>Results</h4>
            <p className="placeholder-text">{project.results || '[Add measured result here]'}</p>
          </div>
          {project.lessons && (
            <div className="detail-block">
              <h4>Lessons Learned</h4>
              <p>{project.lessons}</p>
            </div>
          )}

          <div className="detail-block">
            <h4>Demonstration</h4>
            {project.youtube_url || project.vimeo_url || project.video_upload_url ? (
              <p>
                {project.youtube_url && <a href={project.youtube_url} target="_blank" rel="noreferrer">Watch on YouTube →</a>}
                {project.vimeo_url && <a href={project.vimeo_url} target="_blank" rel="noreferrer" style={{ marginLeft: 14 }}>Watch on Vimeo →</a>}
                {project.video_upload_url && <a href={project.video_upload_url} target="_blank" rel="noreferrer" style={{ marginLeft: 14 }}>Watch demo →</a>}
              </p>
            ) : (
              <p className="placeholder-text">[Add project demonstration video here]</p>
            )}
          </div>

          {project.technologies?.length > 0 && (
            <div className="detail-block">
              <h4>Technologies</h4>
              <div className="tag-row" style={{ paddingTop: 0 }}>
                {project.technologies.map((t) => (
                  <span className="chip" key={t}>{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            {project.github_url ? (
              <a href={project.github_url} className="btn btn-primary" target="_blank" rel="noreferrer">
                View Source Code
              </a>
            ) : (
              <span className="placeholder-text">[Add GitHub repository link]</span>
            )}
            {project.demo_url && (
              <a href={project.demo_url} className="btn btn-ghost" target="_blank" rel="noreferrer">
                Live Demo →
              </a>
            )}
            <a href="/#projects" className="btn btn-ghost">← Back to Projects</a>
          </div>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </>
  );
}
