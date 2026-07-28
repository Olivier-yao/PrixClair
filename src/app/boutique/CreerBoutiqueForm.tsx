"use client";

import { useActionState } from "react";
import { creerBoutiqueAction } from "./actions";

const etatInitial = { erreur: null as string | null };

export function CreerBoutiqueForm() {
  const [etat, action, enCours] = useActionState(creerBoutiqueAction, etatInitial);

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="nom"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Nom de la boutique
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Ex: Chez Awa Mode"
        />
      </div>
      {etat.erreur && <p className="text-sm text-red-600">{etat.erreur}</p>}
      <button
        type="submit"
        disabled={enCours}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-base font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {enCours ? "Creation..." : "Creer ma boutique"}
      </button>
    </form>
  );
}
