import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";
import { ZonesLivraisonForm } from "./ZonesLivraisonForm";

export default async function LivraisonPage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-8 dark:bg-black">
      <main className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Livraison</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Ces zones et prix seront affiches en pied de page de ton catalogue.
          </p>
        </div>

        <ZonesLivraisonForm boutiqueId={boutique.id} zonesInitiales={boutique.zones_livraison} />
      </main>
    </div>
  );
}
