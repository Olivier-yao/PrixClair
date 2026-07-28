import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeconnexionButton } from "./DeconnexionButton";
import { BottomNav } from "./BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-orange-50 dark:bg-stone-950">
      <header className="flex items-center justify-between border-b border-orange-100 bg-white px-6 py-3 dark:border-stone-800 dark:bg-stone-900">
        <span className="text-lg font-bold text-orange-700">PrixClair</span>
        <DeconnexionButton />
      </header>
      <div className="flex flex-1 flex-col pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
