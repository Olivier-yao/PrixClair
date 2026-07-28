import { createElement as h } from "react";
import type { Boutique, Vente } from "@/lib/data/types";
import { formatDate, formatFcfa } from "./commun";
import { bordureFestonnee, codeBarresDecoratif } from "./ticket";

const PAGE_BG = "#e7e2d8";
const CARD_BG = "#fffdf7";
const TEXTE = "#1c1917";
const MUTED = "#78716c";
const ROUGE = "#b91c1c";
const LARGEUR_TICKET = 860;

// Recu remis a l'acheteur une fois le paiement effectue (Wave/Orange Money/
// especes, gere manuellement hors app) : mise en forme "ticket de caisse".
export function construireRecuPaiement(boutique: Boutique, vente: Vente) {
  const sousTotalProduits = vente.produit_prix * vente.quantite;
  const police = { fontFamily: "Courier Prime" };

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: PAGE_BG,
        ...police,
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: LARGEUR_TICKET,
          backgroundColor: CARD_BG,
          borderRadius: 6,
          boxShadow: "0 20px 45px rgba(28,25,23,0.18)",
          overflow: "hidden",
        },
      },
      h("img", {
        src: bordureFestonnee(LARGEUR_TICKET, PAGE_BG),
        width: LARGEUR_TICKET,
        height: 16,
      }),

      h(
        "div",
        { style: { display: "flex", flexDirection: "column", padding: "8px 56px 48px", gap: 22 } },

        // En-tete boutique
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 } },
          h(
            "div",
            {
              style: {
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: 2,
                color: TEXTE,
                textTransform: "uppercase",
              },
            },
            boutique.nom,
          ),
          h(
            "div",
            { style: { fontSize: 18, color: MUTED, letterSpacing: 1 } },
            `RECU DE PAIEMENT · N° ${vente.numero} · ${formatDate(vente.created_at)}`,
          ),
        ),

        ligneDiscontinue(),

        // Client
        ligneTicket("CLIENT", vente.client_nom),
        ligneTicket("TELEPHONE", vente.client_telephone),

        ligneDiscontinue(),

        // Tableau article / montant
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: 700,
              color: MUTED,
              letterSpacing: 1,
              borderBottom: `2px solid ${TEXTE}`,
              paddingBottom: 8,
            },
          },
          h("div", {}, "ARTICLE"),
          h("div", {}, "MONTANT"),
        ),

        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", fontSize: 22, color: TEXTE } },
          h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h("div", {}, vente.produit_nom),
            h(
              "div",
              { style: { fontSize: 16, color: MUTED } },
              `${formatFcfa(vente.produit_prix)} x ${vente.quantite}${vente.produit_variantes ? ` · ${vente.produit_variantes}` : ""}`,
            ),
          ),
          h("div", {}, formatFcfa(sousTotalProduits)),
        ),

        ligneTicket(`LIVRAISON (${vente.zone_livraison_nom.toUpperCase()})`, formatFcfa(vente.zone_livraison_prix)),

        ligneDiscontinue(),

        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              fontSize: 30,
              fontWeight: 700,
              color: TEXTE,
            },
          },
          h("div", {}, "TOTAL"),
          h("div", {}, formatFcfa(vente.montant_total)),
        ),

        ligneTicket("PAIEMENT", vente.mode_paiement.toUpperCase()),

        // Tampon + remerciement
        h(
          "div",
          { style: { display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12, position: "relative" } },
          h(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                fontSize: 20,
                color: TEXTE,
              },
            },
            h("div", {}, "MERCI POUR VOTRE ACHAT"),
          ),
          h(
            "div",
            {
              style: {
                position: "absolute",
                right: 30,
                top: -10,
                display: "flex",
                border: `4px solid ${ROUGE}`,
                borderRadius: 8,
                padding: "6px 18px",
                color: ROUGE,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 3,
                transform: "rotate(-9deg)",
              },
            },
            "PAYE",
          ),
        ),

        // Code-barres
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 8 } },
          h("img", {
            src: codeBarresDecoratif(vente.numero, 320, 56, TEXTE),
            width: 320,
            height: 56,
          }),
          h("div", { style: { fontSize: 16, color: MUTED, letterSpacing: 4 } }, vente.numero),
        ),
      ),
    ),
  );
}

function ligneTicket(label: string, valeur: string) {
  return h(
    "div",
    { style: { display: "flex", justifyContent: "space-between", fontSize: 18, color: "#1c1917" } },
    h("div", { style: { color: "#78716c" } }, label),
    h("div", { style: { fontWeight: 700 } }, valeur),
  );
}

function ligneDiscontinue() {
  return h("div", { style: { borderBottom: "3px dashed #a8a29e" } });
}
