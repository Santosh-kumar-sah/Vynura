-- ==============================================================================
-- Vynura Passive Re-engagement Notifications Schema Migration
-- Migration: 20260916_notifications.sql
-- ==============================================================================

-- Ensure user_preferences table exists
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_recap_shown_month TEXT,
  ambient_sound_enabled BOOLEAN DEFAULT true,
  particle_density TEXT DEFAULT 'high',
  notifications_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure notifications_enabled column exists if table is already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_preferences' 
      AND column_name = 'notifications_enabled'
  ) THEN
    ALTER TABLE public.user_preferences ADD COLUMN notifications_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;
