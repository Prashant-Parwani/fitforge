create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  phone text,
  role text default 'member',
  membership_type text,
  goal text,
  weight numeric,
  height numeric,
  onboarded boolean default false,
  app_data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists goal text;
alter table public.profiles add column if not exists weight numeric;
alter table public.profiles add column if not exists height numeric;
alter table public.profiles add column if not exists onboarded boolean default false;
alter table public.profiles add column if not exists app_data jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists updated_at timestamptz default now();

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
