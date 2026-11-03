-- Apply once to this project's Lovable Cloud backend. Store only blurred previews.
begin;

create table public.gallery_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery-previews', 'gallery-previews', true, 2097152, array['image/jpeg']);

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

commit;

-- After creating an administrator in Authentication > Users, run separately:
-- insert into public.gallery_admins (user_id) values ('UUID-DO-USUARIO');
