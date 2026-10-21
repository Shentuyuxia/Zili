-- Cloud sync for email login, shared by 字里行间 · Entrelinhas, Shiori and 字里 · Zili
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- One row per user and app. Each person can only read and write their own row.

create table if not exists public.user_data (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  app        text        not null check (app in ('entrelinhas', 'shiori', 'zili')),
  data       text        not null check (octet_length(data) < 8000000),
  version    bigint      not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, app)
);

alter table public.user_data enable row level security;

drop policy if exists "read own"   on public.user_data;
drop policy if exists "insert own" on public.user_data;
drop policy if exists "update own" on public.user_data;
drop policy if exists "delete own" on public.user_data;

create policy "read own"   on public.user_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own" on public.user_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own" on public.user_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own" on public.user_data for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.user_data from anon;
grant select, insert, update, delete on public.user_data to authenticated;

-- "Delete my account": removes the login and, through the foreign key, all synced data.
create or replace function public.delete_me()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;
