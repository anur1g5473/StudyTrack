-- schema8_landing.sql
-- Run this in the Supabase SQL Editor

-- 1. Create feedbacks table
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- 3. Public policy: Anyone can view featured feedback
CREATE POLICY "Public can view featured feedback" 
    ON public.feedbacks 
    FOR SELECT 
    USING (is_featured = true);

-- 4. Auth policy: Users can insert their own feedback
CREATE POLICY "Users can insert their own feedback" 
    ON public.feedbacks 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 5. Auth policy: Users can view their own feedback
CREATE POLICY "Users can view their own feedback" 
    ON public.feedbacks 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- 6. Admin policies
CREATE POLICY "Admins can view all feedbacks" 
    ON public.feedbacks 
    FOR SELECT 
    USING (public.is_admin_user());

CREATE POLICY "Admins can update feedbacks" 
    ON public.feedbacks 
    FOR UPDATE 
    USING (public.is_admin_user());
    
CREATE POLICY "Admins can delete feedbacks" 
    ON public.feedbacks 
    FOR DELETE
    USING (public.is_admin_user());

-- 7. Global Aggregations RPC
-- This function aggregates and returns the total users and total hours securely.
-- Security Definer ensures it bypasses RLS so any public user can get the totals
-- without being able to query individual rows.
CREATE OR REPLACE FUNCTION get_global_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_users_count integer;
    total_minutes_sum integer;
    result json;
BEGIN
    SELECT count(id), COALESCE(sum(total_study_minutes), 0)
    INTO total_users_count, total_minutes_sum
    FROM public.profiles;

    result := json_build_object(
        'total_users', total_users_count,
        'total_minutes', total_minutes_sum
    );

    RETURN result;
END;
$$;
