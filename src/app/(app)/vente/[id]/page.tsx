import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { obtenirVente } from "@/lib/data/ventes";
import { formatFcfa } from "@/lib/format";
import { DIMENSIONS_DOCUMENT } from "@/lib/documents/commun";
import { Conteneur } from "@/components/ui/Conteneur";
import { boutonPrimaire, boutonSecondaire, carte } from "@/components/ui/styles";

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
    <Conteneur>
      <div className={`text-center ${carte}`}>
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
          Vente enregistree
        </p>
        <h1 className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-50">
          {vente.produit_nom}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          N° {vente.numero} · {formatFcfa(vente.montant_total)}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Fiche de presentation (a montrer au client)
        </h2>
        <Image
          src={`/vente/${vente.id}/fiche?apercu=1`}
          alt="Apercu fiche de presentation"
          width={width}
          height={height}
          unoptimized
          className="w-full rounded-2xl border border-orange-100 dark:border-stone-800"
        />
        <a href={`/vente/${vente.id}/fiche`} className={boutonPrimaire}>
          Telecharger la fiche (PDF)
        </a>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-stone-700 dark:text-stone-300">Recu de paiement</h2>
        <Image
          src={`/vente/${vente.id}/recu?apercu=1`}
          alt="Apercu recu de paiement"
          width={width}
          height={height}
          unoptimized
          className="w-full rounded-2xl border border-orange-100 dark:border-stone-800"
        />
        <a href={`/vente/${vente.id}/recu`} className={boutonSecondaire}>
          Telecharger le recu (PDF)
        </a>
      </section>

      <div className="flex gap-3">
        <Link href="/vente" className={boutonSecondaire}>
          Nouvelle vente
        </Link>
        <Link href="/ventes" className={boutonSecondaire}>
          Historique
        </Link>
      </div>
    </Conteneur>
  );
}
