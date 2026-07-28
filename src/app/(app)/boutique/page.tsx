import Link from "next/link";
import { getBoutique } from "@/lib/data/boutiques";
import { CreerBoutiqueForm } from "./CreerBoutiqueForm";
import { Conteneur } from "@/components/ui/Conteneur";
import { boutonPrimaire, boutonSecondaire, carte } from "@/components/ui/styles";

export default async function BoutiquePage() {
  const boutique = await getBoutique();

  return (
    <Conteneur>
      <div className={carte}>
        {boutique ? (
          <>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
              {boutique.nom}
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              Boutique enregistree. Gere tes produits, ta livraison, et cree tes ventes.
            </p>
            <div className="mt-6 space-y-3">
              <Link href="/vente" className={boutonPrimaire}>
                Nouvelle vente
              </Link>
              <Link href="/produits" className={boutonSecondaire}>
                Gerer mes produits
              </Link>
              <Link href="/livraison" className={boutonSecondaire}>
                Configurer la livraison
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
              Creer ma boutique
            </h1>
            <CreerBoutiqueForm />
          </>
        )}
      </div>
    </Conteneur>
  );
}
