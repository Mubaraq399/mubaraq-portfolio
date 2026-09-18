import { createClient } from '@/lib/supabaseServer';
import EducationManager from '@/components/EducationManager';

export const dynamic = 'force-dynamic';

export default async function AdminEducationPage() {
  const supabase = createClient();
  const { data: entries } = await supabase.from('education').select('*').order('order_index', { ascending: true });

  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 24 }}>Education</h1>
      <EducationManager entries={entries || []} />
    </div>
  );
}
