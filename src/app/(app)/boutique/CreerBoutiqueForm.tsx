"use client";

import { useActionState } from "react";
import { creerBoutiqueAction } from "./actions";
import { boutonPrimaire, champ, erreurTexte, etiquette } from "@/components/ui/styles";

const etatInitial = { erreur: null as string | null };

export function CreerBoutiqueForm() {
  const [etat, action, enCours] = useActionState(creerBoutiqueAction, etatInitial);

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="nom" className={etiquette}>
          Nom de la boutique
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          className={`mt-1 ${champ}`}
          placeholder="Ex: Chez Awa Mode"
        />
      </div>
      {etat.erreur && <p className={erreurTexte}>{etat.erreur}</p>}
      <button type="submit" disabled={enCours} className={boutonPrimaire}>
        {enCours ? "Creation..." : "Creer ma boutique"}
      </button>
    </form>
  );
}
