import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeconnexionButton } from "./DeconnexionButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex gap-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Link href="/boutique">Boutique</Link>
          <Link href="/produits">Produits</Link>
          <Link href="/livraison">Livraison</Link>
          <Link href="/vente">Nouvelle vente</Link>
          <Link href="/ventes">Historique</Link>
        </div>
        <DeconnexionButton />
      </nav>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
