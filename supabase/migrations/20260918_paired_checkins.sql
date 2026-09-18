-- ==============================================================================
-- Vynura Paired Check-ins (Mutual Consent) Schema Migration
-- Migration: 20260918_paired_checkins.sql
-- ==============================================================================

-- 1. Table for Mutually Consented Pair Connections
CREATE TABLE IF NOT EXISTS public.pair_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'active', 'revoked')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.pair_connections ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can view their own pair connections, or look up a pending invitation by code to accept it
CREATE POLICY "Users can view their own pair connections"
  ON public.pair_connections FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b OR status = 'pending');

-- Users can create/update pairs they belong to
CREATE POLICY "Users can create/update pairs they're part of"
  ON public.pair_connections FOR ALL
  USING (auth.uid() = user_a OR auth.uid() = user_b)
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- 4. Index for fast invite lookup and active status
CREATE INDEX IF NOT EXISTS idx_pair_connections_users
  ON public.pair_connections(user_a, user_b, status);

CREATE INDEX IF NOT EXISTS idx_pair_connections_invite
  ON public.pair_connections(invite_code);
