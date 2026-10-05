"""
Gera supabase/002_bebedouros.sql a partir de data/pontos.geojson.
Builds supabase/002_bebedouros.sql from data/pontos.geojson.

Uso / usage:  python3 scripts/gerar_sql.py
Depois corre o ficheiro gerado no Supabase (SQL Editor). Volta a correr os dois
sempre que data/pontos.geojson mudar: os bebedouros são atualizados, nunca duplicados.
"""
import json, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
MAX_M = 50  # a photo must be taken within this many metres of a bebedouro
# Lisbon municipality with ~1 km margin around the 438 bebedouros.
LAT_MIN, LAT_MAX, LNG_MIN, LNG_MAX = 38.68, 38.80, -9.235, -9.08

with open(os.path.join(ROOT, "data", "pontos.geojson"), encoding="utf-8") as f:
    feats = [ft for ft in json.load(f)["features"] if ft["properties"]["kind"] == "bebedouro"]
rows = ",\n".join(
    "('%s',%.6f,%.6f)" % (ft["id"], ft["geometry"]["coordinates"][1], ft["geometry"]["coordinates"][0])
    for ft in sorted(feats, key=lambda ft: ft["id"])
)

SQL = f"""-- Mata-Sede: só bebedouros, e só fotos tiradas junto a um. GERADO por scripts/gerar_sql.py, não editar à mão.
-- Run in Supabase → SQL Editor after 001 (setup.sql). Safe to run again.
--
-- 1. public.bebedouros: the {len(feats)} bebedouros from Lisboa Aberta (id + position). Not readable by the site.
-- 2. Every new photo is checked by the database before it is saved:
--    - it must carry the photo's own location, inside Lisbon;
--    - it must be within {MAX_M} m of a bebedouro, and gets linked to it (the sender's pick if that one is
--      within {MAX_M} m, otherwise the nearest);
--    - both image files must already be in storage;
--    - the credit is trimmed and cleaned, an impossible date is dropped, moderation always starts as pending.
-- 3. The site can read only public columns of approved photos, and write only what a new photo needs.

create table if not exists public.bebedouros (
  id  text primary key check (id ~ '^[0-9a-f-]{{36}}$'),
  lat double precision not null,
  lng double precision not null
);
alter table public.bebedouros enable row level security;  -- no policies: invisible to the public API
revoke all on public.bebedouros from anon, authenticated;

insert into public.bebedouros (id, lat, lng) values
{rows}
on conflict (id) do update set lat = excluded.lat, lng = excluded.lng;

alter table public.photos
  add column if not exists photo_lat  double precision,
  add column if not exists photo_lng  double precision,
  add column if not exists distance_m integer;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'photos_point_is_bebedouro') then
    alter table public.photos add constraint photos_point_is_bebedouro
      foreign key (point_id) references public.bebedouros (id);
  end if;
end $$;

create or replace function public.distancia_m(lat1 double precision, lng1 double precision,
                                              lat2 double precision, lng2 double precision)
returns double precision language sql immutable as $f$
  select 2 * 6371000 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)));
$f$;

create or replace function public.photos_validar()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $f$
declare
  pick_id text; pick_m double precision;
  near_id text; near_m double precision;
begin
  if new.photo_lat is null or new.photo_lng is null then
    raise exception 'sem_localizacao' using hint = 'A foto não tem localização.';
  end if;
  if new.photo_lat not between {LAT_MIN} and {LAT_MAX} or new.photo_lng not between {LNG_MIN} and {LNG_MAX} then
    raise exception 'fora_de_lisboa' using hint = 'A foto não foi tirada em Lisboa.';
  end if;

  select id, distancia_m(new.photo_lat, new.photo_lng, lat, lng) into near_id, near_m
    from public.bebedouros order by 2 limit 1;
  if near_m > {MAX_M} then
    raise exception 'longe_de_bebedouro' using hint = format('O bebedouro mais perto fica a %s m.', round(near_m));
  end if;
  select id, distancia_m(new.photo_lat, new.photo_lng, lat, lng) into pick_id, pick_m
    from public.bebedouros where id = new.point_id;
  if pick_id is not null and pick_m <= {MAX_M} then
    new.point_id := pick_id; new.distance_m := round(pick_m);
  else
    new.point_id := near_id; new.distance_m := round(near_m);
  end if;

  if not exists (select 1 from storage.objects where bucket_id = 'fotos' and name = new.storage_path)
     or not exists (select 1 from storage.objects where bucket_id = 'fotos'
                    and name = regexp_replace(new.storage_path, '\\.jpg$', '-t.jpg')) then
    raise exception 'foto_em_falta' using hint = 'O ficheiro da foto não chegou.';
  end if;

  -- line breaks and tabs become spaces, other control characters go, runs of spaces collapse
  new.credit := nullif(left(btrim(regexp_replace(regexp_replace(regexp_replace(coalesce(new.credit, ''),
    '[\\t\\n\\r]', ' ', 'g'), '[[:cntrl:]]', '', 'g'), '\\s+', ' ', 'g')), 60), '');
  if new.taken_at is not null and (new.taken_at > now() + interval '1 day' or new.taken_at < timestamptz '2005-01-01') then
    new.taken_at := null;
  end if;
  new.moderation := 'pending';
  new.created_at := now();
  return new;
end;
$f$;

drop trigger if exists photos_validar on public.photos;
create trigger photos_validar before insert on public.photos
  for each row execute function public.photos_validar();

revoke select on public.photos from anon, authenticated;
grant select (id, point_id, storage_path, taken_at, credit, moderation, created_at)
  on public.photos to anon, authenticated;
revoke insert, update, delete on public.photos from anon, authenticated;
grant insert (point_id, storage_path, taken_at, credit, photo_lat, photo_lng)
  on public.photos to anon, authenticated;
"""

out = os.path.join(ROOT, "supabase", "002_bebedouros.sql")
with open(out, "w", encoding="utf-8") as f:
    f.write(SQL)
print("OK:", out, len(feats), "bebedouros")
