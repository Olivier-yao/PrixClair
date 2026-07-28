"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compresserImage } from "@/lib/images/compresser";
import type { ModePaiement, ZoneLivraison } from "@/lib/data/types";
import { creerVenteAction } from "./actions";

const MODES_PAIEMENT: ModePaiement[] = ["Wave", "Orange Money", "Especes", "Autre"];

export function NouvelleVenteForm({
  boutiqueId,
  zonesLivraison,
}: {
  boutiqueId: string;
  zonesLivraison: ZoneLivraison[];
}) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [etape, setEtape] = useState<1 | 2>(1);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [variantes, setVariantes] = useState("");

  function validerEtape1(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    if (!photo) {
      setErreur("Ajoute une photo du produit.");
      return;
    }
    if (!nom.trim() || !prix) {
      setErreur("Le nom et le prix sont obligatoires.");
      return;
    }
    setEtape(2);
  }

  async function validerVente(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);

    const formData = new FormData(e.currentTarget);
    const zoneNom = String(formData.get("zone") ?? "");
    const zone = zonesLivraison.find((z) => z.nom === zoneNom);
    const quantite = Number(formData.get("quantite"));
    const clientNom = String(formData.get("client_nom") ?? "").trim();
    const clientTelephone = String(formData.get("client_telephone") ?? "").trim();
    const modePaiement = String(formData.get("mode_paiement")) as ModePaiement;

    if (!zone) {
      setErreur("Choisis une zone de livraison.");
      return;
    }
    if (!clientNom || !clientTelephone) {
      setErreur("Les informations du client sont obligatoires.");
      return;
    }

    setEnCours(true);
    try {
      const compressee = await compresserImage(photo!);
      const chemin = `${boutiqueId}/${crypto.randomUUID()}.jpg`;

      const { error: erreurUpload } = await supabase.storage
        .from("produits")
        .upload(chemin, compressee, { contentType: "image/jpeg" });
      if (erreurUpload) throw erreurUpload;

      const {
        data: { publicUrl },
      } = supabase.storage.from("produits").getPublicUrl(chemin);

      const resultat = await creerVenteAction({
        boutique_id: boutiqueId,
        produit_nom: nom,
        produit_prix: Number(prix),
        produit_photo_url: publicUrl,
        produit_description: description || undefined,
        produit_variantes: variantes || undefined,
        quantite,
        zone_livraison_nom: zone.nom,
        zone_livraison_prix: zone.prix,
        client_nom: clientNom,
        client_telephone: clientTelephone,
        mode_paiement: modePaiement,
      });

      if (resultat.erreur || !resultat.id) {
        setErreur(resultat.erreur ?? "Erreur inattendue.");
        return;
      }

      router.push(`/vente/${resultat.id}`);
    } catch {
      setErreur("Erreur lors de la validation. Reessaie.");
    } finally {
      setEnCours(false);
    }
  }

  if (etape === 1) {
    return (
      <form onSubmit={validerEtape1} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">1. Le produit</h2>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Photo</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nom du produit</label>
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Robe wax bleue"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Prix (FCFA)</label>
          <input
            type="number"
            min={0}
            step={1}
            required
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="Ex: 15000"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description (optionnel)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Variante (optionnel)
          </label>
          <input
            type="text"
            value={variantes}
            onChange={(e) => setVariantes(e.target.value)}
            placeholder="Ex: Taille M, Rouge"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-base font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Suivant
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={validerVente} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        2. Livraison, client et paiement
      </h2>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Quantite</label>
        <input
          type="number"
          name="quantite"
          min={1}
          step={1}
          defaultValue={1}
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Zone de livraison
        </label>
        <select
          name="zone"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
        >
          {zonesLivraison.map((zone) => (
            <option key={zone.nom} value={zone.nom}>
              {zone.nom} ({zone.prix.toLocaleString("fr-FR")} FCFA)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nom du client</label>
        <input
          type="text"
          name="client_nom"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Telephone du client
        </label>
        <input
          type="tel"
          name="client_telephone"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Mode de paiement
        </label>
        <select
          name="mode_paiement"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
        >
          {MODES_PAIEMENT.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setEtape(1)}
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-base font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          Retour
        </button>
        <button
          type="submit"
          disabled={enCours}
          className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-base font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {enCours ? "Validation..." : "Valider la vente"}
        </button>
      </div>
    </form>
  );
}
