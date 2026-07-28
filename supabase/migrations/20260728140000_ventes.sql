-- Chaque vente correspond a un produit vendu (avec quantite), remplace le
-- catalogue multi-produits : le vendeur saisit un produit a la volee, choisit
-- une zone de livraison, renseigne l'acheteur, puis genere fiche + recu.
create table if not exists ventes (
  id uuid primary key default gen_random_uuid(),
  boutique_id uuid not null references boutiques (id) on delete cascade,
  numero text not null unique,

  produit_nom text not null,
  produit_prix integer not null check (produit_prix >= 0),
  produit_photo_url text,
  produit_description text,
  produit_variantes text,
  quantite integer not null default 1 check (quantite > 0),

  zone_livraison_nom text not null,
  zone_livraison_prix integer not null check (zone_livraison_prix >= 0),

  client_nom text not null,
  client_telephone text not null,
  mode_paiement text not null check (mode_paiement in ('Wave', 'Orange Money', 'Especes', 'Autre')),

  montant_produits integer not null check (montant_produits >= 0),
  montant_livraison integer not null check (montant_livraison >= 0),
  montant_total integer not null check (montant_total >= 0),

  created_at timestamptz not null default now()
);

create index if not exists ventes_boutique_id_idx on ventes (boutique_id);

alter table ventes enable row level security;

create policy "Le vendeur gere les ventes de sa boutique"
  on ventes for all
  using (exists (
    select 1 from boutiques b
    where b.id = ventes.boutique_id and b.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from boutiques b
    where b.id = ventes.boutique_id and b.user_id = auth.uid()
  ));
