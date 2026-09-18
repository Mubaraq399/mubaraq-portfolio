import { createClient } from '@/lib/supabaseServer';
import ExperienceManager from '@/components/ExperienceManager';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
  const supabase = createClient();
  const { data: entries } = await supabase.from('experience').select('*').order('order_index', { ascending: true });

  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 24 }}>Experience</h1>
      <ExperienceManager entries={entries || []} />
    </div>
  );
}
