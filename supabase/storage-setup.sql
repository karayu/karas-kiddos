-- Storage bucket setup for checklists
-- Note: You've already created the "checklists" bucket in Supabase Storage
-- This file is for reference only

-- If you need to recreate the bucket, run:
-- insert into storage.buckets (id, name, public)
-- values ('checklists', 'checklists', true)
-- on conflict (id) do nothing;

-- Set up storage policies for public read access (if not already set)
-- create policy "Public read access" on storage.objects
--   for select using (bucket_id = 'checklists');

-- create policy "Public insert access" on storage.objects
--   for insert with check (bucket_id = 'checklists');

-- Note: For production, you may want to restrict insert access to authenticated users only

