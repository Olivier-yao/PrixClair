import type { Boutique, Vente } from "@/lib/data/types";
import { formatDate } from "@/lib/documents/commun";
import { formatFcfa } from "@/lib/format";
import { bordureFestonnee, codeBarresDecoratif } from "@/lib/documents/ticket";
import { courierPrime } from "@/lib/fonts/courierPrime";

const PAGE_BG = "#e7e2d8";
const CARD_BG = "#fffdf7";
const TEXTE = "#1c1917";
const MUTED = "#78716c";
const ROUGE = "#b91c1c";
const LARGEUR_REF = 640;

// Rendu HTML du recu (meme apparence que le PDF genere par
// src/lib/documents/recu.ts) pour un affichage net et natif dans la page,
// le telechargement PDF restant disponible pour l'impression/le partage.
export function RecuTicket({ boutique, vente }: { boutique: Boutique; vente: Vente }) {
  const sousTotalProduits = vente.produit_prix * vente.quantite;

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: PAGE_BG }}>
      <div
        className={`overflow-hidden rounded-md shadow-lg ${courierPrime.className}`}
        style={{ backgroundColor: CARD_BG }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bordureFestonnee(LARGEUR_REF, PAGE_BG)} alt="" className="block w-full" />

        <div className="flex flex-col gap-4 px-6 pb-8 pt-1 sm:px-9">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="text-2xl font-bold tracking-wide uppercase" style={{ color: TEXTE }}>
              {boutique.nom}
            </div>
            <div className="text-xs tracking-wide" style={{ color: MUTED }}>
              RECU DE PAIEMENT · N° {vente.numero} · {formatDate(vente.created_at)}
            </div>
          </div>

          <div className="border-t-2 border-dashed" style={{ borderColor: "#a8a29e" }} />

          <LigneTicket label="CLIENT" valeur={vente.client_nom} />
          <LigneTicket label="TELEPHONE" valeur={vente.client_telephone} />

          <div className="border-t-2 border-dashed" style={{ borderColor: "#a8a29e" }} />

          <div
            className="flex justify-between border-b-2 pb-2 text-xs font-bold tracking-wide"
            style={{ color: MUTED, borderColor: TEXTE }}
          >
            <span>ARTICLE</span>
            <span>MONTANT</span>
          </div>

          <div className="flex justify-between text-base" style={{ color: TEXTE }}>
            <div className="flex flex-col">
              <span>{vente.produit_nom}</span>
              <span className="text-xs" style={{ color: MUTED }}>
                {formatFcfa(vente.produit_prix)} x {vente.quantite}
                {vente.produit_variantes ? ` · ${vente.produit_variantes}` : ""}
              </span>
            </div>
            <span>{formatFcfa(sousTotalProduits)}</span>
          </div>

          <LigneTicket
            label={`LIVRAISON (${vente.zone_livraison_nom.toUpperCase()})`}
            valeur={formatFcfa(vente.zone_livraison_prix)}
          />

          <div className="border-t-2 border-dashed" style={{ borderColor: "#a8a29e" }} />

          <div className="flex justify-between text-2xl font-bold" style={{ color: TEXTE }}>
            <span>TOTAL</span>
            <span>{formatFcfa(vente.montant_total)}</span>
          </div>

          <LigneTicket label="PAIEMENT" valeur={vente.mode_paiement.toUpperCase()} />

          <div className="mt-2 flex flex-col items-center gap-3">
            <div
              className="-rotate-6 rounded border-4 px-3 py-1 text-lg font-bold tracking-widest"
              style={{ borderColor: ROUGE, color: ROUGE }}
            >
              PAYE
            </div>
            <div className="text-center text-sm sm:text-base" style={{ color: TEXTE }}>
              MERCI POUR VOTRE ACHAT
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={codeBarresDecoratif(vente.numero, 260, 46, TEXTE)}
              alt=""
              className="h-auto w-full max-w-[200px]"
            />
            <div className="text-xs tracking-[0.3em]" style={{ color: MUTED }}>
              {vente.numero}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LigneTicket({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex justify-between text-sm" style={{ color: TEXTE }}>
      <span style={{ color: MUTED }}>{label}</span>
      <span className="font-bold">{valeur}</span>
    </div>
  );
}
