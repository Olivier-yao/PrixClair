import { createClient } from "@/lib/supabase/server";
import type { Produit } from "./types";

export async function listerProduits(boutique_id: string): Promise<Produit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produits")
    .select("*")
    .eq("boutique_id", boutique_id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function creerProduit(input: {
  boutique_id: string;
  nom: string;
  prix: number;
  photo_url?: string | null;
  description?: string | null;
  variantes?: string | null;
}): Promise<Produit> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produits")
    .insert({
      boutique_id: input.boutique_id,
      nom: input.nom,
      prix: input.prix,
      photo_url: input.photo_url ?? null,
      description: input.description ?? null,
      variantes: input.variantes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function mettreAJourProduit(
  id: string,
  patch: Partial<
    Pick<Produit, "nom" | "prix" | "photo_url" | "description" | "variantes" | "en_rupture">
  >,
): Promise<Produit> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produits")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function supprimerProduit(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("produits").delete().eq("id", id);
  if (error) throw error;
}
