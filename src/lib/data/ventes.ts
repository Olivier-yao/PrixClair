import { createClient } from "@/lib/supabase/server";
import type { ModePaiement, Vente } from "./types";

function genererNumero(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O/1/I pour eviter les confusions
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export async function creerVente(input: {
  boutique_id: string;
  produit_nom: string;
  produit_prix: number;
  produit_photo_url: string;
  produit_description?: string | null;
  produit_variantes?: string | null;
  quantite: number;
  zone_livraison_nom: string;
  zone_livraison_prix: number;
  client_nom: string;
  client_telephone: string;
  mode_paiement: ModePaiement;
}): Promise<Vente> {
  const supabase = await createClient();

  const montant_produits = input.produit_prix * input.quantite;
  const montant_livraison = input.zone_livraison_prix;
  const montant_total = montant_produits + montant_livraison;

  // Tres faible probabilite de collision (8 caracteres, alphabet de 32) ;
  // on retente une fois en cas de conflit sur la contrainte unique.
  for (let tentative = 0; tentative < 2; tentative++) {
    const { data, error } = await supabase
      .from("ventes")
      .insert({
        boutique_id: input.boutique_id,
        numero: genererNumero(),
        produit_nom: input.produit_nom,
        produit_prix: input.produit_prix,
        produit_photo_url: input.produit_photo_url,
        produit_description: input.produit_description ?? null,
        produit_variantes: input.produit_variantes ?? null,
        quantite: input.quantite,
        zone_livraison_nom: input.zone_livraison_nom,
        zone_livraison_prix: input.zone_livraison_prix,
        client_nom: input.client_nom,
        client_telephone: input.client_telephone,
        mode_paiement: input.mode_paiement,
        montant_produits,
        montant_livraison,
        montant_total,
      })
      .select()
      .single();

    if (!error) return data;
    if (error.code !== "23505" || tentative === 1) throw error;
  }

  throw new Error("Impossible de generer un numero unique.");
}

export async function obtenirVente(id: string): Promise<Vente | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("ventes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listerVentes(boutique_id: string): Promise<Vente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ventes")
    .select("*")
    .eq("boutique_id", boutique_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
