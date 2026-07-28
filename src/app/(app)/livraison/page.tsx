import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";
import { ZonesLivraisonForm } from "./ZonesLivraisonForm";
import { Conteneur } from "@/components/ui/Conteneur";
import { EnTetePage } from "@/components/ui/EnTetePage";

export default async function LivraisonPage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");

  return (
    <Conteneur>
      <EnTetePage
        titre="Livraison"
        sousTitre="Ces zones et prix seront proposees a chaque nouvelle vente."
      />
      <ZonesLivraisonForm boutiqueId={boutique.id} zonesInitiales={boutique.zones_livraison} />
    </Conteneur>
  );
}
