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
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
  avatar text;
begin
  display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );

  insert into public.profiles (
    user_id,
    email,
    full_name,
    avatar_url,
    onboarded,
    app_data
  )
  values (
    new.id,
    new.email,
    display_name,
    avatar,
    false,
    jsonb_build_object(
      'id', new.id,
      'name', display_name,
      'email', new.email,
      'avatarUrl', avatar,
      'onboarded', false
    )
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    app_data = public.profiles.app_data || excluded.app_data,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
