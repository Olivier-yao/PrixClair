import { createElement as h } from "react";
import type { Boutique, Produit } from "@/lib/data/types";
import { formatFcfa } from "@/lib/format";

// Nombre maximum de produits affichables dans l'image (limite de la mise en
// page en une seule page) ; le PDF multi-pages montrera le catalogue complet.
const MAX_PRODUITS_IMAGE = 10;

export function construireCatalogueImage(boutique: Boutique, produits: Produit[]) {
  const produitsAffiches = produits.slice(0, MAX_PRODUITS_IMAGE);
  const lignes = decouperEnLignes(produitsAffiches, 2);

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        fontFamily: "sans-serif",
      },
    },
    construireEntete(boutique),
    construireGrille(lignes),
    construirePiedDePage(boutique),
  );
}

function construireEntete(boutique: Boutique) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "32px 40px",
        borderBottom: "3px solid #111827",
      },
    },
    boutique.logo_url
      ? h("img", {
          src: boutique.logo_url,
          width: 72,
          height: 72,
          style: { borderRadius: 16, objectFit: "cover" },
        })
      : null,
    h("div", { style: { fontSize: 44, fontWeight: 700, color: "#111827" } }, boutique.nom),
  );
}

function construireGrille(lignes: Produit[][]) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 24,
        gap: 20,
        justifyContent: "center",
      },
    },
    ...lignes.map((ligne, i) =>
      h(
        "div",
        { key: i, style: { display: "flex", gap: 20 } },
        ...ligne.map((produit) => construireCarteProduit(produit)),
      ),
    ),
  );
}

function construireCarteProduit(produit: Produit) {
  return h(
    "div",
    {
      key: produit.id,
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#f9fafb",
        borderRadius: 20,
        overflow: "hidden",
      },
    },
    produit.photo_url
      ? h("img", {
          src: produit.photo_url,
          style: { width: "100%", height: 460, objectFit: "cover" },
        })
      : null,
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", padding: 20, gap: 6 } },
      h("div", { style: { fontSize: 30, fontWeight: 600, color: "#111827" } }, produit.nom),
      h(
        "div",
        { style: { fontSize: 34, fontWeight: 700, color: "#111827" } },
        formatFcfa(produit.prix),
      ),
      produit.variantes
        ? h("div", { style: { fontSize: 20, color: "#6b7280" } }, produit.variantes)
        : null,
      produit.en_rupture
        ? h(
            "div",
            { style: { fontSize: 22, color: "#dc2626", fontWeight: 700 } },
            "RUPTURE DE STOCK",
          )
        : null,
    ),
  );
}

function construirePiedDePage(boutique: Boutique) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        padding: "24px 40px",
        borderTop: "3px solid #111827",
        gap: 8,
      },
    },
    h("div", { style: { fontSize: 26, fontWeight: 700, color: "#111827" } }, "Livraison"),
    h(
      "div",
      { style: { display: "flex", flexWrap: "wrap", gap: 20 } },
      ...boutique.zones_livraison.map((zone) =>
        h(
          "div",
          { key: zone.nom, style: { fontSize: 22, color: "#374151" } },
          `${zone.nom} : ${formatFcfa(zone.prix)}`,
        ),
      ),
    ),
  );
}

function decouperEnLignes<T>(items: T[], taille: number): T[][] {
  const lignes: T[][] = [];
  for (let i = 0; i < items.length; i += taille) lignes.push(items.slice(i, i + taille));
  return lignes;
}
