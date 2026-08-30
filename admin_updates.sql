CREATE OR REPLACE FUNCTION get_user_count() RETURNS integer LANGUAGE sql SECURITY DEFINER AS $$ SELECT count(*)::integer FROM auth.users; $$;
CREATE POLICY "Allow admin to update any job" ON public.jobs FOR UPDATE USING (auth.jwt() ->> 'email' = 'admin@koble.no');
CREATE POLICY "Allow admin to update any worker profile" ON public.worker_profiles FOR UPDATE USING (auth.jwt() ->> 'email' = 'admin@koble.no');
