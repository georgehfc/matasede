-- Mata-Sede: fotos. Run once in Supabase → SQL Editor → New query → Run.
-- Safe to run again: it skips what already exists.
--
-- What it sets up:
--   * table public.photos: one row per photo, starts as 'pending'
--   * private storage bucket 'fotos': JPEG only, max 5 MB per file
--   * rules: anyone can send a photo (pending); only approved photos can be seen.
--
-- To approve a photo: Table Editor → photos → change moderation to 'approved'.
-- To look at it first: Storage → fotos → fotos/<storage_path>.

create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  point_id     text not null check (point_id ~ '^[0-9a-f-]{36}$'),
  storage_path text not null unique check (storage_path ~ '^fotos/[0-9a-f-]{36}\.jpg$'),
  taken_at     timestamptz,
  credit       text check (char_length(credit) <= 60),
  moderation   text not null default 'pending' check (moderation in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now()
);

alter table public.photos enable row level security;

drop policy if exists "approved photos are public" on public.photos;
create policy "approved photos are public" on public.photos
  for select to anon, authenticated
  using (moderation = 'approved');

drop policy if exists "anyone can send a pending photo" on public.photos;
create policy "anyone can send a pending photo" on public.photos
  for insert to anon, authenticated
  with check (moderation = 'pending');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', false, 5242880, array['image/jpeg'])
on conflict (id) do update
  set public = false, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg'];

drop policy if exists "anyone can upload a photo file" on storage.objects;
create policy "anyone can upload a photo file" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'fotos' and name ~ '^fotos/[0-9a-f-]{36}(-t)?\.jpg$');

-- A file (or its -t thumbnail) is readable only once its photo row is approved.
drop policy if exists "approved photo files are public" on storage.objects;
create policy "approved photo files are public" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'fotos'
    and exists (
      select 1 from public.photos p
      where p.moderation = 'approved'
        and p.storage_path = regexp_replace(storage.objects.name, '-t\.jpg$', '.jpg')
    )
  );
