import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 24 }}>Add New Project</h1>
      <p className="mute" style={{ marginBottom: 24, fontSize: 14 }}>
        Save the basic information first — media upload fields unlock once the project has been created.
      </p>
      <ProjectForm mode="new" project={null} images={[]} />
    </div>
  );
}
