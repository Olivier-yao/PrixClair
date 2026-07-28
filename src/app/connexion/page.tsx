"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { boutonPrimaire, carte, champ, erreurTexte, etiquette, lienDiscret } from "@/components/ui/styles";

export default function ConnexionPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [etape, setEtape] = useState<"telephone" | "code">("telephone");
  const [telephone, setTelephone] = useState("+225");
  const [code, setCode] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyerCode(e: FormEvent) {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    const { error } = await supabase.auth.signInWithOtp({ phone: telephone });
    setChargement(false);
    if (error) {
      setErreur(error.message);
      return;
    }
    setEtape("code");
  }

  async function verifierCode(e: FormEvent) {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    const { error } = await supabase.auth.verifyOtp({
      phone: telephone,
      token: code,
      type: "sms",
    });
    setChargement(false);
    if (error) {
      setErreur(error.message);
      return;
    }
    router.push("/boutique");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-orange-50 px-6 dark:bg-stone-950">
      <main className={`w-full max-w-sm ${carte}`}>
        <div className="mb-6 text-center text-xl font-bold text-orange-600">PrixClair</div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">Connexion</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          {etape === "telephone"
            ? "Entre ton numero de telephone pour recevoir un code."
            : `Code envoye au ${telephone}.`}
        </p>

        {etape === "telephone" ? (
          <form onSubmit={envoyerCode} className="mt-6 space-y-4">
            <div>
              <label htmlFor="telephone" className={etiquette}>
                Numero de telephone
              </label>
              <input
                id="telephone"
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className={`mt-1 ${champ}`}
                placeholder="+2250700000000"
              />
            </div>
            {erreur && <p className={erreurTexte}>{erreur}</p>}
            <button type="submit" disabled={chargement} className={boutonPrimaire}>
              {chargement ? "Envoi..." : "Recevoir le code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifierCode} className="mt-6 space-y-4">
            <div>
              <label htmlFor="code" className={etiquette}>
                Code recu par SMS
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`mt-1 ${champ}`}
                placeholder="123456"
              />
            </div>
            {erreur && <p className={erreurTexte}>{erreur}</p>}
            <button type="submit" disabled={chargement} className={boutonPrimaire}>
              {chargement ? "Verification..." : "Se connecter"}
            </button>
            <button type="button" onClick={() => setEtape("telephone")} className={`block w-full text-center ${lienDiscret}`}>
              Changer de numero
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
