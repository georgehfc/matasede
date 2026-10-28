-- Mata-Sede: delete a photo's coordinates once it has been reviewed. Run in Supabase → SQL Editor after
-- 002_bebedouros.sql. Safe to run again. Run it in BOTH projects: matasede-teste first, then the real one.
--
-- Why: photo_lat / photo_lng (the photo's GPS, or the phone's location when the camera left none) exist
-- only so the database can check the photo was taken within 50 m of a bebedouro. Once a photo is
-- approved or rejected they have done their job, so we keep only distance_m (how far from the fountain).
--
-- What it sets up:
--   * a trigger: when moderation changes from 'pending' to 'approved' or 'rejected', the coordinates are
--     set to empty in the same save. Nothing else changes.
--   * a one-off clean-up of photos already reviewed before this file was run.
--
-- Photos still 'pending' keep their coordinates until someone reviews them. Review the queue at least
-- once a month so nothing waits there long.

create or replace function public.photos_apagar_coordenadas()
returns trigger language plpgsql set search_path = public, pg_temp as $f$
begin
  if new.moderation <> 'pending' then
    new.photo_lat := null;
    new.photo_lng := null;
  end if;
  return new;
end;
$f$;

drop trigger if exists photos_apagar_coordenadas on public.photos;
create trigger photos_apagar_coordenadas before update of moderation on public.photos
  for each row execute function public.photos_apagar_coordenadas();

-- One-off: photos reviewed before this rule existed (including the founder's seed photos).
update public.photos set photo_lat = null, photo_lng = null
  where moderation <> 'pending' and (photo_lat is not null or photo_lng is not null);
