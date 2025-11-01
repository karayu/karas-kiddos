-- Enums
create type category as enum ('bedtime','getting_out_the_door','chores','new_situations','favorites');
create type content_type as enum ('checklist','story','song_lyrics','schedule','calendar');
create type engagement_event_type as enum ('view','play','share');

-- Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  home_address text,
  trial_ends_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  role text,
  age int,
  interests jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  age int,
  photo_url text,
  physical_traits jsonb default '{}'::jsonb,
  interests jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null,
  title text not null,
  category category not null,
  type content_type not null,
  body jsonb not null,
  cover_url text,
  is_public boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  content_id uuid references public.content_items(id) on delete cascade,
  sort_order int default 0,
  unique (profile_id, content_id)
);

create table if not exists public.engagement_events (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.content_items(id) on delete cascade,
  viewer_profile_id uuid references public.profiles(id) on delete set null,
  event_type engagement_event_type not null,
  created_at timestamptz default now()
);

create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.content_items(id) on delete cascade,
  token text unique not null,
  expires_at timestamptz
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.family_members enable row level security;
alter table public.children enable row level security;
alter table public.content_items enable row level security;
alter table public.favorites enable row level security;
alter table public.engagement_events enable row level security;
alter table public.shares enable row level security;
alter table public.purchases enable row level security;

-- Policies (owner)
create policy "profiles own row" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "family own" on public.family_members for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "children own" on public.children for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
-- Public MVP: allow anonymous select of public items; allow inserts with null profile
drop policy if exists "content own" on public.content_items;
create policy "content public read" on public.content_items for select using (is_public);
create policy "content public insert" on public.content_items for insert with check (is_public = true);
drop policy if exists "favorites own" on public.favorites;
-- Favorites not used in public MVP
drop policy if exists "engagement read own" on public.engagement_events;
create policy "engagement public select" on public.engagement_events for select using (true);
create policy "engagement insert" on public.engagement_events for insert with check (true);
create policy "shares read public" on public.shares for select using (true);
create policy "purchases own" on public.purchases for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Seed public templates for new situations (profile_id null, is_public true)

-- Helper view/rpc for engagement by category (optional)
-- (Reverted) engagement aggregation helpers removed for now
insert into public.content_items (profile_id, child_id, title, category, type, body, is_public)
values
  (null, null, 'Seeing the Dentist', 'new_situations', 'story', '{"story_html":"<p>A friendly story about visiting the dentist...</p>"}', true),
  (null, null, 'Sleepover at Grandma\'s', 'new_situations', 'story', '{"story_html":"<p>Getting ready for a fun sleepover...</p>"}', true),
  (null, null, 'Starting a New School', 'new_situations', 'story', '{"story_html":"<p>What to expect on your first day...</p>"}', true),
  (null, null, 'Joining the Soccer Team', 'new_situations', 'story', '{"story_html":"<p>Teamwork and trying new things...</p>"}', true)
on conflict do nothing;


