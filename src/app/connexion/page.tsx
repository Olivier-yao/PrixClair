"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Connexion</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {etape === "telephone"
            ? "Entre ton numero de telephone pour recevoir un code."
            : `Code envoye au ${telephone}.`}
        </p>

        {etape === "telephone" ? (
          <form onSubmit={envoyerCode} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Numero de telephone
              </label>
              <input
                id="telephone"
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="+2250700000000"
              />
            </div>
            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button
              type="submit"
              disabled={chargement}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-base font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
            >
              {chargement ? "Envoi..." : "Recevoir le code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifierCode} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Code recu par SMS
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="123456"
              />
            </div>
            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button
              type="submit"
              disabled={chargement}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-base font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
            >
              {chargement ? "Verification..." : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={() => setEtape("telephone")}
              className="w-full text-sm text-zinc-500 underline"
            >
              Changer de numero
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
