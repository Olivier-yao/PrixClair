import Link from "next/link";
import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";
import { listerVentes } from "@/lib/data/ventes";
import { formatFcfa } from "@/lib/format";

export default async function VentesPage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");

  const ventes = await listerVentes(boutique.id);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-8 dark:bg-black">
      <main className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Historique des ventes</h1>

        {ventes.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Aucune vente enregistree pour l&apos;instant.</p>
        ) : (
          <ul className="space-y-3">
            {ventes.map((vente) => (
              <li key={vente.id}>
                <Link
                  href={`/vente/${vente.id}`}
                  className="block rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{vente.produit_nom}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    N° {vente.numero} · {vente.client_nom} · {formatFcfa(vente.montant_total)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
