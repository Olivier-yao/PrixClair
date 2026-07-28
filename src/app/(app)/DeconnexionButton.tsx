"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { lienDiscret } from "@/components/ui/styles";

export function DeconnexionButton() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  async function seDeconnecter() {
    await supabase.auth.signOut();
    router.push("/connexion");
    router.refresh();
  }

  return (
    <button type="button" onClick={seDeconnecter} className={lienDiscret}>
      Se deconnecter
    </button>
  );
}
