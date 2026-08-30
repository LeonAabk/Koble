-- SQL for setting up DELETE Row Level Security (RLS) policies for admin

-- For jobs table
CREATE POLICY "Allow admin to delete any job"
ON public.jobs
FOR DELETE
USING (auth.jwt() ->> 'email' = 'admin@koble.no');

-- For worker_profiles table
CREATE POLICY "Allow admin to delete any worker profile"
ON public.worker_profiles
FOR DELETE
USING (auth.jwt() ->> 'email' = 'admin@koble.no');