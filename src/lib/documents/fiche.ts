import { createElement as h } from "react";
import type { Boutique, Vente } from "@/lib/data/types";
import {
  COULEURS,
  construireCarte,
  construireEnTeteDocument,
  construireLigneDetail,
  construirePiedDePageDocument,
  formatDate,
  formatFcfa,
} from "./commun";

// Fiche montree au client pour le convaincre avant qu'il valide/paie sa
// commande : photo, prix, details de la commande, elements de reassurance.
export function construireFichePresentation(boutique: Boutique, vente: Vente) {
  const sousTotal = vente.produit_prix * vente.quantite;

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COULEURS.fond,
        fontFamily: "sans-serif",
        color: COULEURS.texte,
      },
    },
    construireEnTeteDocument(boutique, "FICHE DE PRÉSENTATION", vente.numero, formatDate(vente.created_at)),

    h(
      "div",
      { style: { display: "flex", flexDirection: "column", flex: 1, padding: 56, gap: 28 } },

      vente.produit_photo_url
        ? h("img", {
            src: vente.produit_photo_url,
            style: {
              width: "100%",
              height: 520,
              objectFit: "cover",
              borderRadius: 24,
              border: `2px solid ${COULEURS.bordure}`,
            },
          })
        : null,

      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 8 } },
        h("div", { style: { fontSize: 46, fontWeight: 700 } }, vente.produit_nom),
        h(
          "div",
          { style: { fontSize: 52, fontWeight: 700, color: COULEURS.accent } },
          formatFcfa(vente.produit_prix),
        ),
        vente.produit_variantes
          ? h(
              "div",
              { style: { fontSize: 22, color: COULEURS.texteMuted } },
              `Variante : ${vente.produit_variantes}`,
            )
          : null,
        vente.produit_description
          ? h("div", { style: { fontSize: 22, color: COULEURS.texteMuted } }, vente.produit_description)
          : null,
      ),

      construireCarte("Details de la commande", [
        construireLigneDetail("Quantite", `${vente.quantite}`),
        construireLigneDetail("Sous-total produits", formatFcfa(sousTotal)),
        construireLigneDetail(`Livraison (${vente.zone_livraison_nom})`, formatFcfa(vente.zone_livraison_prix)),
        h("div", { style: { height: 2, backgroundColor: COULEURS.bordure, margin: "4px 0" } }),
        construireLigneDetail("Total a payer", formatFcfa(vente.montant_total), true),
      ]),

      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 10,
            backgroundColor: COULEURS.accentClair,
            borderRadius: 20,
            padding: 24,
          },
        },
        construireLignePuce("Produit photographie tel qu'il sera envoye"),
        construireLignePuce(`Livraison a ${vente.zone_livraison_nom}`),
        construireLignePuce("Reglement via Wave, Orange Money ou especes a la livraison"),
      ),
    ),

    construirePiedDePageDocument(boutique, "Merci de votre confiance"),
  );
}

function construireLignePuce(texte: string) {
  return h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 20 } },
    h("div", { style: { color: COULEURS.accent, fontWeight: 700 } }, "•"),
    h("div", {}, texte),
  );
}
