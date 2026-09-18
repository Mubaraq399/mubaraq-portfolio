import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const message = (body.message || '').toString().trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from('messages').insert({ name, email, message });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Every message is already saved to Supabase and visible in
  // /admin/messages — that's the real backend, nothing else is required.
  // If you'd also like an email notification the moment someone submits
  // the form, set FORMSPREE_ENDPOINT (or wire up EmailJS the same way)
  // in your environment variables and this forwards the same fields
  // there. It's optional and never blocks the form if it fails or isn't set.
  if (process.env.FORMSPREE_ENDPOINT) {
    try {
      await fetch(process.env.FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
    } catch {
      // Notification forwarding is best-effort only — the message is
      // already safely stored in Supabase regardless of this outcome.
    }
  }

  return NextResponse.json({ ok: true });
}
