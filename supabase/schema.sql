-- ==============================================================================
-- Vynura: Supabase PostgreSQL Schema for Mood Entries & Constellations
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create mood_entries table
create table if not exists public.mood_entries (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  mood_category text not null check (mood_category in ('happy', 'calm', 'sad', 'energetic', 'neutral')),
  confidence_score double precision not null check (confidence_score >= 0 and confidence_score <= 1),
  journal_text text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null
);

-- Indices for performance
create index if not exists idx_mood_entries_user_id on public.mood_entries(user_id);
create index if not exists idx_mood_entries_created_at on public.mood_entries(created_at desc);
create index if not exists idx_mood_entries_category on public.mood_entries(mood_category);

-- Enable Row Level Security (RLS)
alter table public.mood_entries enable row level security;

-- RLS Policies: Users can only read and write their own mood entries
create policy "Users can select their own mood entries"
  on public.mood_entries
  for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own mood entries"
  on public.mood_entries
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update their own mood entries"
  on public.mood_entries
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own mood entries"
  on public.mood_entries
  for delete
  using (auth.uid() = user_id);
