-- ============================================================
-- Mubaraq Portfolio — Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query.
-- Safe to re-run: uses "if not exists" / "or replace" where possible.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ADMINS
-- Membership in this table is what makes a Supabase Auth user
-- an admin. There is no public sign-up page in the app — you
-- create the user in Authentication -> Users, then insert their
-- id here (see README "Create your admin user").
-- ------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = uid);
$$;

-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  category text not null default 'Embedded Systems',
  project_date date,
  status text not null default 'draft' check (status in ('draft','published')),

  problem text default '',
  objective text default '',
  role text default '',
  hardware text default '',
  software text default '',
  how_it_works text default '',
  workflow text default '',
  testing text default '',
  results text default '',
  lessons text default '',

  technologies text[] not null default '{}',

  github_url text default '',
  demo_url text default '',
  cover_image text default '',

  youtube_url text default '',
  vimeo_url text default '',
  video_upload_url text default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on projects(status);
create index if not exists projects_slug_idx on projects(slug);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
before update on projects
for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- PROJECT IMAGES (gallery, pcb, schematic, prototype, final, etc.)
-- ------------------------------------------------------------
create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  kind text not null default 'gallery' check (kind in ('gallery','pcb','schematic','prototype','final')),
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_images_project_idx on project_images(project_id);

-- ------------------------------------------------------------
-- SKILLS
-- ------------------------------------------------------------
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- EXPERIENCE
-- ------------------------------------------------------------
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  organization text not null,
  period text not null,
  description text default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- EDUCATION
-- ------------------------------------------------------------
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  period text default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MESSAGES (contact form submissions)
-- ------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SETTINGS (single row of editable site-wide fields)
-- ------------------------------------------------------------
create table if not exists settings (
  id int primary key default 1,
  email text default '',
  linkedin_url text default '',
  github_url text default '',
  cv_url text default '',
  status_message text default 'Open to Engineering Opportunities',
  updated_at timestamptz not null default now()
);
insert into settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists settings_set_updated_at on settings;
create trigger settings_set_updated_at
before update on settings
for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table projects enable row level security;
alter table project_images enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table messages enable row level security;
alter table settings enable row level security;
alter table admins enable row level security;

-- PROJECTS: public can read published rows; admins can do everything.
drop policy if exists "projects_public_read" on projects;
create policy "projects_public_read" on projects
  for select using (status = 'published' or is_admin(auth.uid()));

drop policy if exists "projects_admin_write" on projects;
create policy "projects_admin_write" on projects
  for insert with check (is_admin(auth.uid()));
drop policy if exists "projects_admin_update" on projects;
create policy "projects_admin_update" on projects
  for update using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
drop policy if exists "projects_admin_delete" on projects;
create policy "projects_admin_delete" on projects
  for delete using (is_admin(auth.uid()));

-- PROJECT_IMAGES: readable if the parent project is readable; writable by admins only.
drop policy if exists "project_images_public_read" on project_images;
create policy "project_images_public_read" on project_images
  for select using (
    is_admin(auth.uid()) or exists (
      select 1 from projects p where p.id = project_images.project_id and p.status = 'published'
    )
  );
drop policy if exists "project_images_admin_write" on project_images;
create policy "project_images_admin_write" on project_images
  for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- SKILLS / EXPERIENCE / EDUCATION: public read, admin write.
drop policy if exists "skills_public_read" on skills;
create policy "skills_public_read" on skills for select using (true);
drop policy if exists "skills_admin_write" on skills;
create policy "skills_admin_write" on skills for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

drop policy if exists "experience_public_read" on experience;
create policy "experience_public_read" on experience for select using (true);
drop policy if exists "experience_admin_write" on experience;
create policy "experience_admin_write" on experience for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

drop policy if exists "education_public_read" on education;
create policy "education_public_read" on education for select using (true);
drop policy if exists "education_admin_write" on education;
create policy "education_admin_write" on education for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- MESSAGES: anyone can insert (contact form); only admins can read/update/delete.
drop policy if exists "messages_public_insert" on messages;
create policy "messages_public_insert" on messages for insert with check (true);
drop policy if exists "messages_admin_read" on messages;
create policy "messages_admin_read" on messages for select using (is_admin(auth.uid()));
drop policy if exists "messages_admin_update" on messages;
create policy "messages_admin_update" on messages for update using (is_admin(auth.uid()));
drop policy if exists "messages_admin_delete" on messages;
create policy "messages_admin_delete" on messages for delete using (is_admin(auth.uid()));

-- SETTINGS: public read, admin write.
drop policy if exists "settings_public_read" on settings;
create policy "settings_public_read" on settings for select using (true);
drop policy if exists "settings_admin_write" on settings;
create policy "settings_admin_write" on settings for update using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- ADMINS: admins can read the admin list (needed for is_admin checks via RLS-safe function);
-- no one can write to it through the API — add rows manually from the SQL editor only.
drop policy if exists "admins_admin_read" on admins;
create policy "admins_admin_read" on admins for select using (is_admin(auth.uid()));

-- ============================================================
-- STORAGE
-- Create a bucket called "project-media" (Storage -> New bucket, "Public" ON)
-- then run the policies below so only admins can upload/delete, and
-- anyone can view (since it's a public bucket serving portfolio images).
-- ============================================================
-- Run in SQL editor after creating the bucket in the dashboard:
--
-- drop policy if exists "project_media_public_read" on storage.objects;
-- create policy "project_media_public_read" on storage.objects
--   for select using (bucket_id = 'project-media');
--
-- drop policy if exists "project_media_admin_write" on storage.objects;
-- create policy "project_media_admin_write" on storage.objects
--   for insert with check (bucket_id = 'project-media' and is_admin(auth.uid()));
--
-- drop policy if exists "project_media_admin_delete" on storage.objects;
-- create policy "project_media_admin_delete" on storage.objects
--   for delete using (bucket_id = 'project-media' and is_admin(auth.uid()));
