"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { compresserImage } from "@/lib/images/compresser";
import { creerProduitAction } from "./actions";

export function AjouterProduitForm({ boutiqueId }: { boutiqueId: string }) {
  const [supabase] = useState(() => createClient());
  const formRef = useRef<HTMLFormElement>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);

    const formData = new FormData(e.currentTarget);
    const fichier = formData.get("photo") as File | null;
    const nom = String(formData.get("nom") ?? "").trim();
    const prix = Number(formData.get("prix"));
    const description = String(formData.get("description") ?? "").trim();
    const variantes = String(formData.get("variantes") ?? "").trim();

    if (!fichier || fichier.size === 0) {
      setErreur("Ajoute une photo du produit.");
      return;
    }

    setEnCours(true);
    try {
      const compressee = await compresserImage(fichier);
      const chemin = `${boutiqueId}/${crypto.randomUUID()}.jpg`;

      const { error: erreurUpload } = await supabase.storage
        .from("produits")
        .upload(chemin, compressee, { contentType: "image/jpeg" });
      if (erreurUpload) throw erreurUpload;

      const {
        data: { publicUrl },
      } = supabase.storage.from("produits").getPublicUrl(chemin);

      const resultat = await creerProduitAction({
        boutique_id: boutiqueId,
        nom,
        prix,
        photo_url: publicUrl,
        description: description || undefined,
        variantes: variantes || undefined,
      });

      if (resultat.erreur) {
        setErreur(resultat.erreur);
        return;
      }

      formRef.current?.reset();
    } catch {
      setErreur("Erreur lors de l'ajout du produit. Reessaie.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Ajouter un produit
      </h2>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Photo
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          required
          className="mt-1 w-full text-sm"
        />
      </div>

      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nom du produit
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Ex: Robe wax bleue"
        />
      </div>

      <div>
        <label htmlFor="prix" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Prix (FCFA)
        </label>
        <input
          id="prix"
          name="prix"
          type="number"
          min={0}
          step={1}
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Ex: 15000"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Description (optionnel)
        </label>
        <input
          id="description"
          name="description"
          type="text"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label
          htmlFor="variantes"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Variantes (optionnel)
        </label>
        <input
          id="variantes"
          name="variantes"
          type="text"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Ex: S/M/L ou Rouge/Noir"
        />
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={enCours}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-base font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {enCours ? "Ajout en cours..." : "Ajouter le produit"}
      </button>
    </form>
  );
}
