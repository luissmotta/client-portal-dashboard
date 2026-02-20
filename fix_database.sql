-- 1. Try to add the columns again safely (if they don't exist)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_type text CHECK (project_type IN ('landing_page', 'institutional', 'ecommerce', 'other'));

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS responsible_dev text;

-- 2. Force Reload Schema Cache (VERY IMPORTANT)
NOTIFY pgrst, 'reload schema';

-- 3. Select 1 project to confirm it worked (Optional)
SELECT id, name, project_type, responsible_dev FROM public.projects LIMIT 1;
