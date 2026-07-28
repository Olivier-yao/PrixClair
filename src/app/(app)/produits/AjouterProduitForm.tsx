"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { compresserImage } from "@/lib/images/compresser";
import { creerProduitAction } from "./actions";
import { boutonPrimaire, carte, champ, erreurTexte, etiquette } from "@/components/ui/styles";

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
    <form ref={formRef} onSubmit={onSubmit} className={`space-y-4 ${carte}`}>
      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">Ajouter un produit</h2>

      <div>
        <label htmlFor="photo" className={etiquette}>
          Photo
        </label>
        <input id="photo" name="photo" type="file" accept="image/*" required className="mt-1 w-full text-sm" />
      </div>

      <div>
        <label htmlFor="nom" className={etiquette}>
          Nom du produit
        </label>
        <input id="nom" name="nom" type="text" required className={`mt-1 ${champ}`} placeholder="Ex: Robe wax bleue" />
      </div>

      <div>
        <label htmlFor="prix" className={etiquette}>
          Prix (FCFA)
        </label>
        <input
          id="prix"
          name="prix"
          type="number"
          min={0}
          step={1}
          required
          className={`mt-1 ${champ}`}
          placeholder="Ex: 15000"
        />
      </div>

      <div>
        <label htmlFor="description" className={etiquette}>
          Description (optionnel)
        </label>
        <input id="description" name="description" type="text" className={`mt-1 ${champ}`} />
      </div>

      <div>
        <label htmlFor="variantes" className={etiquette}>
          Variantes (optionnel)
        </label>
        <input
          id="variantes"
          name="variantes"
          type="text"
          className={`mt-1 ${champ}`}
          placeholder="Ex: S/M/L ou Rouge/Noir"
        />
      </div>

      {erreur && <p className={erreurTexte}>{erreur}</p>}

      <button type="submit" disabled={enCours} className={boutonPrimaire}>
        {enCours ? "Ajout en cours..." : "Ajouter le produit"}
      </button>
    </form>
  );
}
