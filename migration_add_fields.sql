-- Add new columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_type text CHECK (project_type IN ('landing_page', 'institutional', 'ecommerce', 'other')),
ADD COLUMN IF NOT EXISTS responsible_dev text;

-- Comment on columns
COMMENT ON COLUMN public.projects.project_type IS 'Type of the project (Landing Page, Institutional, etc)';
COMMENT ON COLUMN public.projects.responsible_dev IS 'Developer responsible for the project';
