import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenirVente } from "@/lib/data/ventes";
import { formatFcfa } from "@/lib/format";

export default async function VenteConfirmeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vente = await obtenirVente(id);
  if (!vente) notFound();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-8 dark:bg-black">
      <main className="w-full max-w-sm space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Vente enregistree
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            N° {vente.numero} · {vente.produit_nom} · {formatFcfa(vente.montant_total)}
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={`/vente/${vente.id}/fiche`}
              className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-base font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Telecharger la fiche de presentation
            </a>
            <a
              href={`/vente/${vente.id}/recu`}
              className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-base font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              Telecharger le recu de paiement
            </a>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/vente"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
          >
            Nouvelle vente
          </Link>
          <Link
            href="/ventes"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
          >
            Historique
          </Link>
        </div>
      </main>
    </div>
  );
}
