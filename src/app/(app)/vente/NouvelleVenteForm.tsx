"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compresserImage } from "@/lib/images/compresser";
import type { ModePaiement, ZoneLivraison } from "@/lib/data/types";
import { creerVenteAction } from "./actions";
import { boutonPrimaire, boutonSecondaire, carte, champ, erreurTexte, etiquette } from "@/components/ui/styles";

const MODES_PAIEMENT: ModePaiement[] = ["Wave", "Orange Money", "Especes", "Autre"];

function IndicateurEtape({ etape }: { etape: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
      <span className={etape === 1 ? "text-orange-600" : ""}>1. Produit</span>
      <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      <span className={etape === 2 ? "text-orange-600" : ""}>2. Livraison &amp; client</span>
    </div>
  );
}

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
      <form onSubmit={validerEtape1} className={`space-y-4 ${carte}`}>
        <IndicateurEtape etape={1} />

        <div>
          <label className={etiquette}>Photo</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>

        <div>
          <label className={etiquette}>Nom du produit</label>
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Robe wax bleue"
            className={`mt-1 ${champ}`}
          />
        </div>

        <div>
          <label className={etiquette}>Prix (FCFA)</label>
          <input
            type="number"
            min={0}
            step={1}
            required
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="Ex: 15000"
            className={`mt-1 ${champ}`}
          />
        </div>

        <div>
          <label className={etiquette}>Description (optionnel)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`mt-1 ${champ}`}
          />
        </div>

        <div>
          <label className={etiquette}>Variante (optionnel)</label>
          <input
            type="text"
            value={variantes}
            onChange={(e) => setVariantes(e.target.value)}
            placeholder="Ex: Taille M, Rouge"
            className={`mt-1 ${champ}`}
          />
        </div>

        {erreur && <p className={erreurTexte}>{erreur}</p>}

        <button type="submit" className={boutonPrimaire}>
          Suivant
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={validerVente} className={`space-y-4 ${carte}`}>
      <IndicateurEtape etape={2} />

      <div>
        <label className={etiquette}>Quantite</label>
        <input
          type="number"
          name="quantite"
          min={1}
          step={1}
          defaultValue={1}
          required
          className={`mt-1 ${champ}`}
        />
      </div>

      <div>
        <label className={etiquette}>Zone de livraison</label>
        <select name="zone" required className={`mt-1 ${champ}`}>
          {zonesLivraison.map((zone) => (
            <option key={zone.nom} value={zone.nom}>
              {zone.nom} ({zone.prix.toLocaleString("fr-FR")} FCFA)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={etiquette}>Nom du client</label>
        <input type="text" name="client_nom" required className={`mt-1 ${champ}`} />
      </div>

      <div>
        <label className={etiquette}>Telephone du client</label>
        <input type="tel" name="client_telephone" required className={`mt-1 ${champ}`} />
      </div>

      <div>
        <label className={etiquette}>Mode de paiement</label>
        <select name="mode_paiement" required className={`mt-1 ${champ}`}>
          {MODES_PAIEMENT.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      {erreur && <p className={erreurTexte}>{erreur}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={() => setEtape(1)} className={boutonSecondaire}>
          Retour
        </button>
        <button type="submit" disabled={enCours} className={boutonPrimaire}>
          {enCours ? "Validation..." : "Valider la vente"}
        </button>
      </div>
    </form>
  );
}
