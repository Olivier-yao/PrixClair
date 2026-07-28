"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { formatFcfa } from "@/lib/format";
import { marquerRuptureAction, supprimerProduitAction } from "./actions";
import type { Produit } from "@/lib/data/types";
import { carte } from "@/components/ui/styles";

export function ProduitLigne({ produit }: { produit: Produit }) {
  const [enTransition, demarrerTransition] = useTransition();
  const [supprime, setSupprime] = useState(false);

  if (supprime) return null;

  return (
    <li className={`flex items-center gap-4 ${carte} !p-4`}>
      {produit.photo_url && (
        <Image
          src={produit.photo_url}
          alt={produit.nom}
          width={64}
          height={64}
          unoptimized
          className="h-16 w-16 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-stone-900 dark:text-stone-50">{produit.nom}</p>
        <p className="text-sm text-stone-600 dark:text-stone-400">{formatFcfa(produit.prix)}</p>
        {produit.variantes && (
          <p className="truncate text-xs text-stone-500 dark:text-stone-500">{produit.variantes}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <label className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
          <input
            type="checkbox"
            defaultChecked={produit.en_rupture}
            disabled={enTransition}
            onChange={(e) =>
              demarrerTransition(() => marquerRuptureAction(produit.id, e.target.checked))
            }
          />
          Rupture
        </label>
        <button
          type="button"
          disabled={enTransition}
          onClick={() =>
            demarrerTransition(async () => {
              await supprimerProduitAction(produit.id);
              setSupprime(true);
            })
          }
          className="text-xs text-red-600 underline disabled:opacity-50 dark:text-red-400"
        >
          Supprimer
        </button>
      </div>
    </li>
  );
}
