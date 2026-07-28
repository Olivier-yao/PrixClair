"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeconnexionButton() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  async function seDeconnecter() {
    await supabase.auth.signOut();
    router.push("/connexion");
    router.refresh();
  }

  return (
    <button type="button" onClick={seDeconnecter} className="text-sm text-zinc-500 underline">
      Se deconnecter
    </button>
  );
}
