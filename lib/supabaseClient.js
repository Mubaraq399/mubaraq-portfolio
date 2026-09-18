'use client';

import { createBrowserClient } from '@supabase/ssr';

// One client per browser tab. Use this in any 'use client' component
// (login form, admin dashboard forms, image uploads, etc.)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
