-- Mata-Sede: relatos (reports). Run in Supabase → SQL Editor after 002_bebedouros.sql. Safe to run again.
-- Run it in BOTH projects: matasede-teste first, then the real one.
--
-- What it sets up:
--   * table public.reports: one row per answer from the fountain card ("Tem taça?", "Torneira para garrafas?",
--     "A funcionar?"). Anyone can answer, no account needed; answers show on the map straight away.
--   * view public.reports_latest: the newest answer per fountain and question. This is what the map shows.
--   * each browser carries a random anonymous id (device). It is never shown to the public. It lets the database:
--       - replace a browser's own answer if it changes its mind within a day (no double counting);
--       - refuse a browser sending more than 30 answers in an hour.
--
-- To undo a bad answer: Table Editor → reports → delete the row. The map goes back to the answer before it.
-- Later, when people sign in, a user column can join device without changing anything else.

create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  point_id   text not null references public.bebedouros (id) on delete cascade,
  field      text not null check (field in ('taca', 'garrafa', 'funciona')),
  value      boolean not null,
  device     uuid not null,
  created_at timestamptz not null default now()
);
create index if not exists reports_point_field on public.reports (point_id, field, created_at desc);
create index if not exists reports_device on public.reports (device, created_at desc);

alter table public.reports enable row level security;

drop policy if exists "reports are public" on public.reports;
create policy "reports are public" on public.reports
  for select to anon, authenticated
  using (true);

drop policy if exists "anyone can report" on public.reports;
create policy "anyone can report" on public.reports
  for insert to anon, authenticated
  with check (true);

create or replace function public.reports_validar()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $f$
begin
  if (select count(*) from public.reports
      where device = new.device and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'demasiados_relatos' using hint = 'Muitas respostas seguidas. Tenta daqui a pouco.';
  end if;
  -- Changing your mind replaces your own recent answer to the same question.
  delete from public.reports
    where device = new.device and point_id = new.point_id and field = new.field
      and created_at > now() - interval '1 day';
  new.created_at := now();
  return new;
end;
$f$;

drop trigger if exists reports_validar on public.reports;
create trigger reports_validar before insert on public.reports
  for each row execute function public.reports_validar();

-- The site may read everything except the device id, and write only what an answer needs.
revoke all on public.reports from anon, authenticated;
grant select (point_id, field, value, created_at) on public.reports to anon, authenticated;
grant insert (point_id, field, value, device) on public.reports to anon, authenticated;

create or replace view public.reports_latest with (security_invoker = true) as
  select distinct on (point_id, field) point_id, field, value, created_at
  from public.reports
  order by point_id, field, created_at desc;
revoke all on public.reports_latest from anon, authenticated;
grant select on public.reports_latest to anon, authenticated;
