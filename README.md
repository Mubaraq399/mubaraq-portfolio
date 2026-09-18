# Mubaraq — Portfolio (Next.js + Supabase)

A portfolio site with a real backend: Supabase Postgres database, Supabase Auth for
the admin login, and Supabase Storage for project images. The public site reads
live data from the database — there is nothing hard-coded to edit in the frontend
code to add, change, or remove a project.

```
Admin Dashboard  →  Supabase Database  →  Public Website
```

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project. Note the project's
   **Project URL** and **anon public key** (Project Settings → API) — you'll need
   both in step 3.
2. Open **SQL Editor** → New query, paste the contents of `supabase/schema.sql`,
   and run it. This creates every table (`projects`, `project_images`, `skills`,
   `experience`, `education`, `messages`, `settings`, `admins`) plus Row Level
   Security policies.
3. (Optional but recommended) Run `supabase/seed.sql` next. It pre-fills the
   Skills, Experience, and Education sections exactly as originally written, and
   adds the six projects as **drafts** with their known details filled in —
   narrative fields you hadn't supplied (problem, objective, results, etc.) are
   left as `[Add ...]` placeholders for you to complete in the dashboard, and no
   project is visible on the public site until you publish it.
4. **Storage bucket**: Storage → New bucket → name it exactly `project-media`,
   toggle **Public** on, then go back to SQL Editor and run the three storage
   policy statements at the bottom of `supabase/schema.sql` (they're commented
   out — uncomment and run them after the bucket exists).

## 2. Create your admin user

There's no public sign-up page on purpose — only accounts you create can access
the dashboard.

1. Authentication → Users → **Add user** → enter your email and a password.
2. Copy that user's UUID from the Users list.
3. SQL Editor → run:
   ```sql
   insert into admins (user_id) values ('paste-the-uuid-here');
   ```
   Only rows in this `admins` table can sign in to `/admin` — creating a
   Supabase Auth user alone is not enough, which is what keeps the dashboard
   private even if someone guesses a password for an unrelated account.

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
Project Settings → API. The anon key is safe to expose to the browser — every
table is protected by the Row Level Security policies from `schema.sql`, not by
keeping this key secret. Nothing in this app uses the Supabase **service role**
key, so it's never in the code or the browser.

## 4. Run it locally

```bash
npm install
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## 5. Deploy

Any Node host works; Vercel is the path of least friction for Next.js:

1. Push this folder to a GitHub repo.
2. Vercel → New Project → import the repo.
3. Add the same two environment variables from `.env.local` in Vercel's project
   settings (Environment Variables), then deploy.
4. Set `NEXT_PUBLIC_SITE_URL` to your real domain once you have one (optional —
   used only for metadata).

## How content flows

- **Add a project**: `/admin/projects/new` → fill in Basic Information → Save.
  Saving creates the row and takes you to the edit page, which unlocks the
  media uploaders (cover image, gallery, circuit/schematic, PCB, prototype,
  final product) — uploads go straight to the `project-media` Storage bucket
  and are linked to the project automatically.
- **Publish/unpublish**: toggle from the Projects table or the Status field on
  the edit form. Only `published` projects are queried by the public site —
  a draft is fully visible in the dashboard but invisible at `/projects/*`
  and on the homepage grid.
- **Edit or delete**: from the Projects table (`Edit`, `Preview`, `Delete`).
  Edits appear on the public site immediately (the pages fetch fresh on every
  request — nothing to rebuild or redeploy).
- **Slugs**: auto-generated from the title, editable before first save. The
  public URL is `/projects/<slug>`.
- **Skills / Experience / Education**: each has its own admin page for adding
  and removing entries; the homepage renders whatever's in the database.
- **Messages**: contact-form submissions land in `/admin/messages` — mark
  read/unread or delete. The public form only has insert access (RLS), so
  visitors can never read other people's messages.
- **Settings**: `/admin/settings` holds the email, LinkedIn URL, GitHub URL, CV
  link, and hero status line — editing these updates every place they appear
  on the public site (hero, GitHub section, CV section, contact section,
  footer) without touching code.

## Contact form → Formspree / EmailJS (optional)

The form already has a real backend: every submission is saved straight to
the `messages` table via `app/api/contact/route.js` and shows up in
`/admin/messages` — you don't need Formspree or EmailJS just to receive
messages.

If you'd *also* like an email notification the moment someone submits the
form, you have two clean options, and neither changes how the form behaves —
messages still save to Supabase either way:

- **Formspree** (simplest — no code changes): create a form at
  [formspree.io](https://formspree.io), copy its endpoint
  (`https://formspree.io/f/xxxxxxx`), and set it as `FORMSPREE_ENDPOINT` in
  your environment variables (see `.env.local.example`). `route.js` forwards
  the same name/email/message to it automatically, fire-and-forget, right
  after the Supabase insert succeeds.
- **EmailJS** (sends straight from the browser): install
  `@emailjs/browser`, then in `components/ContactForm.js` call
  `emailjs.send(...)` alongside the existing `fetch('/api/contact', ...)`
  call, using your EmailJS service ID, template ID, and public key.

## Extending it later

The schema was built so you can add more content types the same way — new
table, RLS policies matching the `skills`/`experience` pattern (public read,
`is_admin(auth.uid())` write), a page under `app/admin/(protected)/`, and a
public section that queries it. Certifications, blog posts, publications,
services, and testimonials would all follow this exact pattern.

## Project structure

```
app/
  page.js                       Public homepage (server component, live data)
  projects/[slug]/page.js       Public project detail page
  api/contact/route.js          Contact form → messages table
  admin/
    login/page.js               Admin sign-in (no public sign-up)
    (protected)/                Everything below requires an authorized admin
      dashboard/page.js         Overview stats
      projects/                 List, new, edit (with media upload)
      skills/ experience/ education/   Simple add/remove managers
      messages/page.js          Contact form inbox
      settings/page.js          Site-wide editable fields
components/                     Shared UI + admin form/table components
lib/
  supabaseClient.js             Browser Supabase client
  supabaseServer.js             Server Supabase client (cookies-aware)
middleware.js                   Protects /admin/* except /admin/login
supabase/
  schema.sql                    Tables + RLS policies (run first)
  seed.sql                      Optional starter content (run second)
```

## Security notes

- Every write to `projects`, `project_images`, `skills`, `experience`,
  `education`, and `settings` is gated by `is_admin(auth.uid())` at the
  database level (Row Level Security), not just hidden in the UI — even a
  direct API call with a stolen anon key can't write without a valid admin
  session.
- `messages` allows public **insert only**; reading, updating, or deleting
  requires an admin session.
- The admin dashboard itself is blocked at the edge by `middleware.js`, which
  redirects to `/admin/login` for anyone without a valid, admin-listed
  session before a protected page ever renders.
