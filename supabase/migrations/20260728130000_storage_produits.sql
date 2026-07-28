-- Bucket public pour les photos produits : les photos doivent etre visibles
-- publiquement (elles seront incluses dans les catalogues generes/partages).
insert into storage.buckets (id, name, public)
values ('produits', 'produits', true)
on conflict (id) do nothing;

-- Convention de chemin : {boutique_id}/{fichier}. Le premier segment du
-- chemin sert a verifier que le vendeur possede bien la boutique.

create policy "Photos produits lisibles publiquement"
  on storage.objects for select
  using (bucket_id = 'produits');

create policy "Le vendeur ajoute des photos dans sa boutique"
  on storage.objects for insert
  with check (
    bucket_id = 'produits'
    and exists (
      select 1 from boutiques b
      where b.id::text = (storage.foldername(name))[1]
        and b.user_id = auth.uid()
    )
  );

create policy "Le vendeur supprime les photos de sa boutique"
  on storage.objects for delete
  using (
    bucket_id = 'produits'
    and exists (
      select 1 from boutiques b
      where b.id::text = (storage.foldername(name))[1]
        and b.user_id = auth.uid()
    )
  );
