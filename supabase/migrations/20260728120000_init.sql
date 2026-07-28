-- Tables de base : boutiques et produits.
-- Un compte (auth.users) = une boutique pour le MVP (cf. hors-scope "multi-boutiques").

create extension if not exists "pgcrypto";

create table if not exists boutiques (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  nom text not null,
  logo_url text,
  zones_livraison jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists produits (
  id uuid primary key default gen_random_uuid(),
  boutique_id uuid not null references boutiques (id) on delete cascade,
  photo_url text,
  nom text not null,
  prix integer not null check (prix >= 0),
  description text,
  variantes text,
  en_rupture boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists produits_boutique_id_idx on produits (boutique_id);

-- Met a jour updated_at automatiquement a chaque modification d'une ligne.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger boutiques_set_updated_at
  before update on boutiques
  for each row execute function set_updated_at();

create trigger produits_set_updated_at
  before update on produits
  for each row execute function set_updated_at();

-- RLS : chaque vendeur ne voit et ne modifie que sa propre boutique et ses produits.
alter table boutiques enable row level security;
alter table produits enable row level security;

create policy "Le vendeur gere sa propre boutique"
  on boutiques for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Le vendeur gere les produits de sa boutique"
  on produits for all
  using (exists (
    select 1 from boutiques b
    where b.id = produits.boutique_id and b.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from boutiques b
    where b.id = produits.boutique_id and b.user_id = auth.uid()
  ));
