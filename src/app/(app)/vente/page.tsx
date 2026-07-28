import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";
import { NouvelleVenteForm } from "./NouvelleVenteForm";

export default async function VentePage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");
  if (boutique.zones_livraison.length === 0) redirect("/livraison");

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-8 dark:bg-black">
      <main className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Nouvelle vente</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Genere une fiche de presentation et un recu de paiement pour cette vente.
          </p>
        </div>

        <NouvelleVenteForm boutiqueId={boutique.id} zonesLivraison={boutique.zones_livraison} />
      </main>
    </div>
  );
}
