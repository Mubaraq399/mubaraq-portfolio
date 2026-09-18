import { createClient } from '@/lib/supabaseServer';
import MessagesTable from '@/components/MessagesTable';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="h-m" style={{ marginBottom: 24 }}>Messages</h1>
      <MessagesTable messages={messages || []} />
    </div>
  );
}
