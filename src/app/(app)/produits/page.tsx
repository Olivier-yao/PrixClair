import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";
import { listerProduits } from "@/lib/data/produits";
import { AjouterProduitForm } from "./AjouterProduitForm";
import { ProduitLigne } from "./ProduitLigne";
import { Conteneur } from "@/components/ui/Conteneur";
import { EnTetePage } from "@/components/ui/EnTetePage";

export default async function ProduitsPage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");

  const produits = await listerProduits(boutique.id);

  return (
    <Conteneur>
      <EnTetePage titre="Mes produits" />

      <AjouterProduitForm boutiqueId={boutique.id} />

      {produits.length > 0 && (
        <ul className="space-y-3">
          {produits.map((produit) => (
            <ProduitLigne key={produit.id} produit={produit} />
          ))}
        </ul>
      )}
    </Conteneur>
  );
}
