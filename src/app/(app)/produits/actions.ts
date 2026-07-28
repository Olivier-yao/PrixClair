"use server";

import { revalidatePath } from "next/cache";
import { creerProduit, mettreAJourProduit, supprimerProduit } from "@/lib/data/produits";

type EtatFormulaire = { erreur: string | null };

export async function creerProduitAction(input: {
  boutique_id: string;
  nom: string;
  prix: number;
  photo_url: string;
  description?: string;
  variantes?: string;
}): Promise<EtatFormulaire> {
  if (!input.nom.trim()) return { erreur: "Le nom du produit est obligatoire." };
  if (!Number.isFinite(input.prix) || input.prix < 0) {
    return { erreur: "Le prix doit etre un nombre positif." };
  }

  try {
    await creerProduit(input);
  } catch {
    return { erreur: "Erreur lors de l'enregistrement. Reessaie." };
  }

  revalidatePath("/produits");
  return { erreur: null };
}

export async function marquerRuptureAction(id: string, en_rupture: boolean): Promise<void> {
  await mettreAJourProduit(id, { en_rupture });
  revalidatePath("/produits");
}

export async function supprimerProduitAction(id: string): Promise<void> {
  await supprimerProduit(id);
  revalidatePath("/produits");
}
