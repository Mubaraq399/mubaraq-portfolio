export default function ProjectCard({ project }) {
  const tech = project.technologies || [];
  return (
    <article className="card">
      <div className="card-visual">
        {project.cover_image ? (
          <img src={project.cover_image} alt={project.title} />
        ) : (
          <span className="ph">Add cover image in admin</span>
        )}
      </div>
      <div className="card-body">
        <div className="card-highlight">{project.category}</div>
        <h3>{project.title}</h3>
        <p>{project.short_description}</p>
        <div className="tag-row">
          {tech.slice(0, 4).map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
          {tech.length > 4 && <span className="chip">+{tech.length - 4}</span>}
        </div>
      </div>
      <div className="card-foot">
        <a href={`/projects/${project.slug}`} className="btn btn-primary btn-sm">
          View Project
        </a>
        {project.github_url ? (
          <a href={project.github_url} className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">
            Source →
          </a>
        ) : (
          <span className="dim" style={{ fontSize: 12 }}>
            No repo linked
          </span>
        )}
      </div>
    </article>
  );
}
