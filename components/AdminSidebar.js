'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

const items = [
  { href: '/admin/dashboard', label: 'Overview' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/experience', label: 'Experience' },
  { href: '/admin/education', label: 'Education' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/settings', label: 'Settings' }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div style={{ fontWeight: 700, padding: '6px 12px 18px' }}>Mubaraq Olalekan · Admin</div>
      {items.map((item) => (
        <a key={item.href} href={item.href} className={pathname.startsWith(item.href) ? 'active' : ''}>
          {item.label}
        </a>
      ))}
      <a href="/" target="_blank" rel="noreferrer" style={{ marginTop: 14 }}>
        View public site ↗
      </a>
      <button
        onClick={handleSignOut}
        className="btn btn-ghost btn-sm"
        style={{ marginTop: 18 }}
      >
        Sign Out
      </button>
    </aside>
  );
}
