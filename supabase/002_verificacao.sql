-- Mata-Sede: verificação automática das fotos. Run once in Supabase → SQL Editor, after setup.sql.
-- Safe to run again.
--
-- Adds:
--   * photo_lat / photo_lng: where the photo was taken (from the photo itself). Private: never public.
--   * check_*: the result of scripts/verificar_fotos.py (GitHub Actions, every 10 minutes).
-- And locks down which columns the public site may read and write.

alter table public.photos
  add column if not exists photo_lat        double precision check (photo_lat between -90 and 90),
  add column if not exists photo_lng        double precision check (photo_lng between -180 and 180),
  add column if not exists check_status     text check (check_status in ('ok', 'rever', 'rejeitar')),
  add column if not exists check_kind       text,
  add column if not exists check_point_id   text,
  add column if not exists check_distance_m integer,
  add column if not exists check_notes      text,
  add column if not exists checked_at       timestamptz;

-- The public site may read only these columns (and only approved rows, per the policy in setup.sql)...
revoke select on public.photos from anon, authenticated;
grant select (id, point_id, storage_path, taken_at, credit, moderation, created_at)
  on public.photos to anon, authenticated;

-- ...and may write only these when sending a photo. moderation and check_* stay server-side.
revoke insert, update, delete on public.photos from anon, authenticated;
grant insert (point_id, storage_path, taken_at, credit, photo_lat, photo_lng)
  on public.photos to anon, authenticated;

-- Handy view for reviewing: newest first, with the job's verdict.
create or replace view public.fotos_para_rever
with (security_invoker = true) as
  select created_at, check_status, check_notes, point_id, check_point_id, check_distance_m,
         credit, storage_path, moderation, id
  from public.photos
  where moderation = 'pending'
  order by created_at desc;
revoke all on public.fotos_para_rever from anon, authenticated;
