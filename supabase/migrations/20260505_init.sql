-- anonymat: aucune métadonnée stockée
create table if not exists responses (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null    default now(),
  age        int         not null    check (age between 1 and 120),
  gender     text        not null    check (gender in ('homme','femme')),
  wish       text        not null    check (char_length(wish) <= 2000)
);

alter table responses enable row level security;

create policy "anon_insert" on responses
  for insert to anon
  with check (true);

-- Vue publique count seulement
create or replace view responses_count as
  select count(*)::int as count from responses;

grant select on responses_count to anon;
