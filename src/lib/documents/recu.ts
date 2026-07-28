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

// Recu remis a l'acheteur une fois le paiement effectue (Wave/Orange Money/
// especes, gere manuellement hors app) : preuve d'achat avec numero unique.
export function construireRecuPaiement(boutique: Boutique, vente: Vente) {
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
    construireEnTeteDocument(boutique, "REÇU DE PAIEMENT", vente.numero, formatDate(vente.created_at)),

    h(
      "div",
      { style: { display: "flex", flexDirection: "column", flex: 1, padding: 56, gap: 24 } },

      construireCarte("Client", [
        construireLigneDetail("Nom", vente.client_nom),
        construireLigneDetail("Telephone", vente.client_telephone),
      ]),

      construireCarte("Produit", [
        construireLigneDetail("Article", vente.produit_nom),
        vente.produit_variantes ? construireLigneDetail("Variante", vente.produit_variantes) : null,
        construireLigneDetail("Prix unitaire", formatFcfa(vente.produit_prix)),
        construireLigneDetail("Quantite", `${vente.quantite}`),
        construireLigneDetail("Sous-total", formatFcfa(sousTotal)),
      ]),

      construireCarte("Livraison", [
        construireLigneDetail("Zone", vente.zone_livraison_nom),
        construireLigneDetail("Frais de livraison", formatFcfa(vente.zone_livraison_prix)),
      ]),

      construireCarte("Paiement", [
        construireLigneDetail("Mode de paiement", vente.mode_paiement),
        h("div", { style: { height: 2, backgroundColor: COULEURS.bordure, margin: "4px 0" } }),
        construireLigneDetail("Montant total paye", formatFcfa(vente.montant_total), true),
      ]),
    ),

    construirePiedDePageDocument(boutique, "Ce recu atteste du paiement recu. Conservez-le."),
  );
}
