import { createClient } from '@/lib/supabaseServer';
import SkillsManager from '@/components/SkillsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const supabase = createClient();
  const { data: skills } = await supabase.from('skills').select('*').order('order_index', { ascending: true });

  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 24 }}>Skills</h1>
      <SkillsManager skills={skills || []} />
    </div>
  );
}
