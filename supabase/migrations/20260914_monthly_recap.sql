-- ==============================================================================
-- Vynura Monthly Brightest Nights Highlight Reel Schema Migration
-- Migration: 20260914_monthly_recap.sql
-- ==============================================================================

-- 1. Table for User Preferences & Feature Tracking
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_recap_shown_month TEXT,
  ambient_sound_enabled BOOLEAN DEFAULT true,
  particle_density TEXT DEFAULT 'high',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure column exists if table was already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_preferences' 
      AND column_name = 'last_recap_shown_month'
  ) THEN
    ALTER TABLE public.user_preferences ADD COLUMN last_recap_shown_month TEXT;
  END IF;
END $$;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
