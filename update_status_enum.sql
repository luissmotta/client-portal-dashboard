-- Add new status values to the projects table constraint
ALTER TABLE public.projects 
DROP CONSTRAINT projects_status_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_status_check 
CHECK (status IN ('active', 'validation', 'adjustments', 'approved', 'completed', 'on_hold', 'archived'));

-- Ensure page statuses are correct too (just in case)
ALTER TABLE public.pages 
DROP CONSTRAINT pages_status_check;

ALTER TABLE public.pages 
ADD CONSTRAINT pages_status_check 
CHECK (status IN ('approved', 'changes_requested', 'in_progress', 'pending_review'));

-- Refresh cache again after this structure change
NOTIFY pgrst, 'reload schema';
