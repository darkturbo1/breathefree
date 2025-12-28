-- Add currency column to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'EUR';