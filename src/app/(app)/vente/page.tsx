import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";
import { NouvelleVenteForm } from "./NouvelleVenteForm";
import { Conteneur } from "@/components/ui/Conteneur";
import { EnTetePage } from "@/components/ui/EnTetePage";

export default async function VentePage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");
  if (boutique.zones_livraison.length === 0) redirect("/livraison");

  return (
    <Conteneur>
      <EnTetePage
        titre="Nouvelle vente"
        sousTitre="Genere une fiche de presentation et un recu de paiement pour cette vente."
      />

      <NouvelleVenteForm boutiqueId={boutique.id} zonesLivraison={boutique.zones_livraison} />
    </Conteneur>
  );
}
