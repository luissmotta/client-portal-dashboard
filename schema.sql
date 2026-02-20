-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (Clients & Admins)
-- Note: Supabase handles auth.users, so we'll create a public profiles table that references it.
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('admin', 'client')) default 'client',
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Projects
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id),
  name text not null,
  description text,
  status text check (status in ('active', 'completed', 'on_hold', 'archived')) default 'active',
  progress integer default 0,
  start_date date,
  deadline date,
  created_at timestamp with time zone default now()
);

-- Pages
create table public.pages (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  url text,
  status text check (status in ('approved', 'changes_requested', 'in_progress', 'pending_review')) default 'pending_review',
  last_updated timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Feedback Items
create table public.feedback_items (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references public.pages(id) on delete cascade,
  category text check (category in ('copy', 'structure', 'images', 'design')),
  content text not null,
  status text check (status in ('pending', 'resolved')) default 'pending',
  created_at timestamp with time zone default now()
);

-- Tasks
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  assignee_id uuid references public.profiles(id),
  due_date date,
  created_at timestamp with time zone default now()
);

-- Calendar Events
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  date timestamp with time zone not null,
  type text check (type in ('delivery', 'meeting', 'milestone'))
);

-- RLS Policies (Row Level Security)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.pages enable row level security;
alter table public.feedback_items enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;

-- Policies

-- Helper function to check if user is admin (optional, but good practice. For now we use email check in app, here we can use a hardcoded check or reliance on app logic if we trust the server actions)
-- For proper RLS security on the DB level:

-- 1. Profiles: Public read, User write own
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

-- 2. Projects: Admin (write), Authenticated (read)
-- NOTE: In a real multi-tenant app, clients should only see THEIR projects (using client_id).
-- Since we are trusting the Server Actions to filter data for now, we will allow 'authenticated' to read.
-- BUT we restrict execute/insert/update/delete to admin only (conceptually).
-- Since Supabase Client is used in Server Actions with Service Role or User Role?
-- We are using standard client in server actions, so RLS applies.

create policy "Authenticated users can view projects" on public.projects for select using (auth.role() = 'authenticated');
create policy "Only admin can insert projects" on public.projects for insert with check (auth.jwt() ->> 'email' = 'luissmotta@outlook.com');
create policy "Only admin can update projects" on public.projects for update using (auth.jwt() ->> 'email' = 'luissmotta@outlook.com');
create policy "Only admin can delete projects" on public.projects for delete using (auth.jwt() ->> 'email' = 'luissmotta@outlook.com');

-- 3. Pages: Admin (write), Authenticated (read)
create policy "Authenticated users can view pages" on public.pages for select using (auth.role() = 'authenticated');
create policy "Only admin can insert pages" on public.pages for insert with check (auth.jwt() ->> 'email' = 'luissmotta@outlook.com');
create policy "Only admin can update pages" on public.pages for update using (auth.jwt() ->> 'email' = 'luissmotta@outlook.com');
create policy "Only admin can delete pages" on public.pages for delete using (auth.jwt() ->> 'email' = 'luissmotta@outlook.com');

-- 4. Feedback: Authenticated can read/insert
create policy "Authenticated users can view feedback" on public.feedback_items for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert feedback" on public.feedback_items for insert with check (auth.role() = 'authenticated');

-- 5. User Role Update (Run this once manually in SQL Editor to set your user as admin if needed for metadata, though we rely on email)
-- update public.profiles set role = 'admin' where email = 'luissmotta@outlook.com';

