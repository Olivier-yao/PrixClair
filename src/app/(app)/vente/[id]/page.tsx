import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { obtenirVente } from "@/lib/data/ventes";
import { formatFcfa } from "@/lib/format";
import { DIMENSIONS_DOCUMENT } from "@/lib/documents/commun";

export default async function VenteConfirmeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vente = await obtenirVente(id);
  if (!vente) notFound();

  const { width, height } = DIMENSIONS_DOCUMENT;

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-8 dark:bg-black">
      <main className="w-full max-w-sm space-y-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Vente enregistree
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            N° {vente.numero} · {vente.produit_nom} · {formatFcfa(vente.montant_total)}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Fiche de presentation (a montrer au client)
          </h2>
          <Image
            src={`/vente/${vente.id}/fiche?apercu=1`}
            alt="Apercu fiche de presentation"
            width={width}
            height={height}
            unoptimized
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
          />
          <a
            href={`/vente/${vente.id}/fiche`}
            className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-base font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
          >
            Telecharger la fiche (PDF)
          </a>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Recu de paiement
          </h2>
          <Image
            src={`/vente/${vente.id}/recu?apercu=1`}
            alt="Apercu recu de paiement"
            width={width}
            height={height}
            unoptimized
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
          />
          <a
            href={`/vente/${vente.id}/recu`}
            className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-base font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
          >
            Telecharger le recu (PDF)
          </a>
        </section>

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
