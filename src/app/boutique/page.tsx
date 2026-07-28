import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBoutique } from "@/lib/data/boutiques";
import { CreerBoutiqueForm } from "./CreerBoutiqueForm";
import { DeconnexionButton } from "./DeconnexionButton";

export default async function BoutiquePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

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
              Boutique enregistree. La suite (produits, livraison, catalogue) arrive aux
              prochaines etapes.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Creer ma boutique
            </h1>
            <CreerBoutiqueForm />
          </>
        )}
        <div className="mt-6">
          <DeconnexionButton />
        </div>
      </main>
    </div>
  );
}
