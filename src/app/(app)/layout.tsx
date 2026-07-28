import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeconnexionButton } from "./DeconnexionButton";

const LIENS_NAV = [
  { href: "/boutique", label: "Boutique" },
  { href: "/produits", label: "Produits" },
  { href: "/livraison", label: "Livraison" },
  { href: "/vente", label: "Nouvelle vente" },
  { href: "/ventes", label: "Historique" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-orange-50 dark:bg-stone-950">
      <header className="border-b border-orange-100 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between px-6 py-3">
          <span className="text-lg font-bold text-orange-600">PrixClair</span>
          <DeconnexionButton />
        </div>
        <nav className="flex gap-2 overflow-x-auto px-6 pb-3 [scrollbar-width:none]">
          {LIENS_NAV.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-orange-100 hover:text-orange-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-orange-400"
            >
              {lien.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
