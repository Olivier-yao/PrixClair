import Link from "next/link";
import { getBoutique } from "@/lib/data/boutiques";
import { CreerBoutiqueForm } from "./CreerBoutiqueForm";

export default async function BoutiquePage() {
  const boutique = await getBoutique();

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        {boutique ? (
          <>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {boutique.nom}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Boutique enregistree. La livraison et le catalogue arrivent aux prochaines etapes.
            </p>
            <Link
              href="/produits"
              className="mt-4 block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-base font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Gerer mes produits
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Creer ma boutique
            </h1>
            <CreerBoutiqueForm />
          </>
        )}
      </main>
    </div>
  );
}
