"use client";

import { useState } from "react";
import type { ZoneLivraison } from "@/lib/data/types";
import { enregistrerZonesLivraisonAction } from "./actions";
import { boutonPrimaire, carte, champ, erreurTexte, lienDiscret, succesTexte } from "@/components/ui/styles";

const zonesParDefaut: ZoneLivraison[] = [
  { nom: "Abidjan", prix: 0 },
  { nom: "Hors Abidjan", prix: 0 },
  { nom: "Retrait sur place", prix: 0 },
];

export function ZonesLivraisonForm({
  boutiqueId,
  zonesInitiales,
}: {
  boutiqueId: string;
  zonesInitiales: ZoneLivraison[];
}) {
  const [zones, setZones] = useState<ZoneLivraison[]>(
    zonesInitiales.length > 0 ? zonesInitiales : zonesParDefaut,
  );
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  function modifierNom(index: number, nom: string) {
    setZones((z) => z.map((zone, i) => (i === index ? { ...zone, nom } : zone)));
  }

  function modifierPrix(index: number, prix: string) {
    setZones((z) => z.map((zone, i) => (i === index ? { ...zone, prix: Number(prix) } : zone)));
  }

  function ajouterZone() {
    setZones((z) => [...z, { nom: "", prix: 0 }]);
  }

  function retirerZone(index: number) {
    setZones((z) => z.filter((_, i) => i !== index));
  }

  async function enregistrer() {
    setEnCours(true);
    setErreur(null);
    setSucces(false);

    const resultat = await enregistrerZonesLivraisonAction(boutiqueId, zones);

    setEnCours(false);
    if (resultat.erreur) {
      setErreur(resultat.erreur);
      return;
    }
    setSucces(true);
  }

  return (
    <div className={`space-y-4 ${carte}`}>
      <div className="space-y-3">
        {zones.map((zone, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={zone.nom}
              onChange={(e) => modifierNom(index, e.target.value)}
              placeholder="Nom de la zone"
              className={`min-w-0 flex-1 ${champ}`}
            />
            <input
              type="number"
              min={0}
              step={1}
              value={zone.prix}
              onChange={(e) => modifierPrix(index, e.target.value)}
              placeholder="Prix"
              className={`w-28 ${champ}`}
            />
            <button
              type="button"
              onClick={() => retirerZone(index)}
              className="text-sm text-red-600 dark:text-red-400"
              aria-label="Retirer cette zone"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={ajouterZone} className={lienDiscret}>
        + Ajouter une zone
      </button>

      {erreur && <p className={erreurTexte}>{erreur}</p>}
      {succes && <p className={succesTexte}>Livraison enregistree.</p>}

      <button type="button" onClick={enregistrer} disabled={enCours} className={boutonPrimaire}>
        {enCours ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
