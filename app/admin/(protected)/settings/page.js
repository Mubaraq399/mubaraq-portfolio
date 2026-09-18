import { createClient } from '@/lib/supabaseServer';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();

  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 24 }}>Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
