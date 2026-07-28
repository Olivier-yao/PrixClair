import Link from "next/link";
import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";
import { listerVentes } from "@/lib/data/ventes";
import { formatFcfa } from "@/lib/format";
import { Conteneur } from "@/components/ui/Conteneur";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { carte } from "@/components/ui/styles";

export default async function VentesPage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");

  const ventes = await listerVentes(boutique.id);

  return (
    <Conteneur>
      <EnTetePage titre="Historique des ventes" />

      {ventes.length === 0 ? (
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Aucune vente enregistree pour l&apos;instant.
        </p>
      ) : (
        <ul className="space-y-3">
          {ventes.map((vente) => (
            <li key={vente.id}>
              <Link href={`/vente/${vente.id}`} className={`block ${carte} !p-4`}>
                <p className="font-medium text-stone-900 dark:text-stone-50">{vente.produit_nom}</p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  N° {vente.numero} · {vente.client_nom} · {formatFcfa(vente.montant_total)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Conteneur>
  );
}
