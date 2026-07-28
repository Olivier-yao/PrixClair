"use server";

import { revalidatePath } from "next/cache";
import { creerBoutique } from "@/lib/data/boutiques";

type EtatFormulaire = { erreur: string | null };

export async function creerBoutiqueAction(
  _etatPrecedent: EtatFormulaire,
  formData: FormData,
): Promise<EtatFormulaire> {
  const nom = String(formData.get("nom") ?? "").trim();
  if (!nom) {
    return { erreur: "Le nom de la boutique est obligatoire." };
  }

  try {
    await creerBoutique({ nom });
  } catch {
    return { erreur: "Erreur lors de la creation. Reessaie." };
  }

  revalidatePath("/boutique");
  return { erreur: null };
}
