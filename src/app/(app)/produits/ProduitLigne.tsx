"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { formatFcfa } from "@/lib/format";
import { marquerRuptureAction, supprimerProduitAction } from "./actions";
import type { Produit } from "@/lib/data/types";

export function ProduitLigne({ produit }: { produit: Produit }) {
  const [enTransition, demarrerTransition] = useTransition();
  const [supprime, setSupprime] = useState(false);

  if (supprime) return null;

  return (
    <li className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
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
        <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">{produit.nom}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatFcfa(produit.prix)}</p>
        {produit.variantes && (
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-500">{produit.variantes}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <label className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
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
          className="text-xs text-red-600 underline disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </li>
  );
}
