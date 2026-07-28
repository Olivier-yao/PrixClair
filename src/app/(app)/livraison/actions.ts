"use server";

import { revalidatePath } from "next/cache";
import { mettreAJourBoutique } from "@/lib/data/boutiques";
import type { ZoneLivraison } from "@/lib/data/types";

type EtatFormulaire = { erreur: string | null };

export async function enregistrerZonesLivraisonAction(
  boutique_id: string,
  zones: ZoneLivraison[],
): Promise<EtatFormulaire> {
  const zonesNettoyees = zones
    .map((zone) => ({ nom: zone.nom.trim(), prix: Number(zone.prix) }))
    .filter((zone) => zone.nom.length > 0);

  if (zonesNettoyees.length === 0) {
    return { erreur: "Ajoute au moins une zone de livraison." };
  }
  if (zonesNettoyees.some((zone) => !Number.isFinite(zone.prix) || zone.prix < 0)) {
    return { erreur: "Chaque prix doit etre un nombre positif." };
  }

  try {
    await mettreAJourBoutique(boutique_id, { zones_livraison: zonesNettoyees });
  } catch {
    return { erreur: "Erreur lors de l'enregistrement. Reessaie." };
  }

  revalidatePath("/livraison");
  return { erreur: null };
}
