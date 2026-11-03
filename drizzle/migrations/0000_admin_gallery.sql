-- Adapted from supabase/migrations/20261103000100_admin_gallery.sql:
-- Storage bucket creation uses the Storage API; transactions are tool-managed.
create table public.gallery_admins (
  user_id uuid primary key
);
grant select on public.gallery_admins to authenticated;
grant all on public.gallery_admins to service_role;
alter table public.gallery_admins enable row level security;
create policy "Admins can check their own membership" on public.gallery_admins
  for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.gallery_admins from anon, authenticated;
grant select on public.gallery_admins to authenticated;

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  storage_path text not null unique,
  created_at timestamptz not null default now()
);
grant select on public.gallery_photos to anon, authenticated;
grant insert (title, storage_path), delete on public.gallery_photos to authenticated;
grant all on public.gallery_photos to service_role;
alter table public.gallery_photos enable row level security;
create policy "Visitors can view gallery" on public.gallery_photos
  for select to anon, authenticated using (true);
create policy "Only admins can add photos" on public.gallery_photos
  for insert to authenticated with check (
    exists (select 1 from public.gallery_admins where user_id = (select auth.uid()))
    and storage_path ~ ('^' || (select auth.uid())::text || '/[a-f0-9-]+\.jpg$')
    and exists (select 1 from storage.objects where bucket_id = 'gallery-previews' and name = storage_path)
  );
create policy "Only admins can delete photos" on public.gallery_photos
  for delete to authenticated using (
    exists (select 1 from public.gallery_admins where user_id = (select auth.uid()))
  );
revoke all on public.gallery_photos from anon, authenticated;
grant select on public.gallery_photos to anon, authenticated;
grant insert (title, storage_path), delete on public.gallery_photos to authenticated;

create policy "Only admins can upload previews" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'gallery-previews'
    and name ~ ('^' || (select auth.uid())::text || '/[a-f0-9-]+\.jpg$')
    and exists (select 1 from public.gallery_admins where user_id = (select auth.uid()))
  );
create policy "Admins can inspect previews" on storage.objects
  for select to authenticated using (
    bucket_id = 'gallery-previews'
    and exists (select 1 from public.gallery_admins where user_id = (select auth.uid()))
  );
create policy "Only admins can delete previews" on storage.objects
  for delete to authenticated using (
    bucket_id = 'gallery-previews'
    and exists (select 1 from public.gallery_admins where user_id = (select auth.uid()))
  );