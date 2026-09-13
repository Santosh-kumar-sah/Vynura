-- ==============================================================================
-- Vynura Quick Spark Micro-Activity System Schema Migration
-- Migration: 20260913_spark_system.sql
-- ==============================================================================

-- 1. Table for Daily Spark Observations & Completion Logs
CREATE TABLE IF NOT EXISTS public.spark_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Table for Starlight Streaks & Gamification Tracking
CREATE TABLE IF NOT EXISTS public.spark_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed_date DATE
);

-- 3. Indexes for fast date-based lookup
CREATE INDEX IF NOT EXISTS idx_spark_log_user_date
  ON public.spark_log(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_spark_streaks_user
  ON public.spark_streaks(user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.spark_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spark_streaks ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Guest mode & Authenticated user support matching mood_entries)
CREATE POLICY "Users can view their own or guest spark logs"
  ON public.spark_log
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own or guest spark logs"
  ON public.spark_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own or guest spark logs"
  ON public.spark_log
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own spark streaks"
  ON public.spark_streaks
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own spark streaks"
  ON public.spark_streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own spark streaks"
  ON public.spark_streaks
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
