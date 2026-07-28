import { createClient } from "@/lib/supabase/server";
import type { Boutique, ZoneLivraison } from "./types";

// Un compte = une boutique pour le MVP : la ligne visible via RLS est celle
// du vendeur connecte, donc un simple select suffit (pas besoin de filtrer
// par user_id, Supabase l'impose deja cote base).
export async function getBoutique(): Promise<Boutique | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("boutiques").select("*").maybeSingle();

  if (error) throw error;
  return data;
}

export async function creerBoutique(input: {
  nom: string;
  logo_url?: string | null;
  zones_livraison?: ZoneLivraison[];
}): Promise<Boutique> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Vendeur non connecte.");

  const { data, error } = await supabase
    .from("boutiques")
    .insert({
      user_id: user.id,
      nom: input.nom,
      logo_url: input.logo_url ?? null,
      zones_livraison: input.zones_livraison ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function mettreAJourBoutique(
  id: string,
  patch: Partial<Pick<Boutique, "nom" | "logo_url" | "zones_livraison">>,
): Promise<Boutique> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boutiques")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
