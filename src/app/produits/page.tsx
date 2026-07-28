import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBoutique } from "@/lib/data/boutiques";
import { listerProduits } from "@/lib/data/produits";
import { AjouterProduitForm } from "./AjouterProduitForm";
import { ProduitLigne } from "./ProduitLigne";

export default async function ProduitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");

  const produits = await listerProduits(boutique.id);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-8 dark:bg-black">
      <main className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Mes produits</h1>

        <AjouterProduitForm boutiqueId={boutique.id} />

        {produits.length > 0 && (
          <ul className="space-y-3">
            {produits.map((produit) => (
              <ProduitLigne key={produit.id} produit={produit} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
