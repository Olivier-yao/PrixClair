"use server";

import { creerVente } from "@/lib/data/ventes";
import type { ModePaiement } from "@/lib/data/types";

export async function creerVenteAction(input: {
  boutique_id: string;
  produit_nom: string;
  produit_prix: number;
  produit_photo_url: string;
  produit_description?: string;
  produit_variantes?: string;
  quantite: number;
  zone_livraison_nom: string;
  zone_livraison_prix: number;
  client_nom: string;
  client_telephone: string;
  mode_paiement: ModePaiement;
}): Promise<{ erreur: string | null; id?: string }> {
  if (!input.produit_nom.trim()) return { erreur: "Le nom du produit est obligatoire." };
  if (!Number.isFinite(input.produit_prix) || input.produit_prix < 0) {
    return { erreur: "Le prix doit etre un nombre positif." };
  }
  if (!input.client_nom.trim() || !input.client_telephone.trim()) {
    return { erreur: "Les informations du client sont obligatoires." };
  }

  try {
    const vente = await creerVente(input);
    return { erreur: null, id: vente.id };
  } catch {
    return { erreur: "Erreur lors de l'enregistrement. Reessaie." };
  }
}
