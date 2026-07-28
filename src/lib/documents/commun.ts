import { createElement as h } from "react";
import type { ReactNode } from "react";
import type { Boutique } from "@/lib/data/types";
import { formatFcfa } from "@/lib/format";

export const COULEURS = {
  accent: "#c2410c",
  accentClair: "#ffedd5",
  fond: "#fffaf5",
  carte: "#ffffff",
  texte: "#1c1917",
  texteMuted: "#78716c",
  bordure: "#e7e5e4",
};

export const DIMENSIONS_DOCUMENT = { width: 1240, height: 1754 };

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function construireEnTeteDocument(
  boutique: Boutique,
  libelle: string,
  numero: string,
  date: string,
) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COULEURS.accent,
        padding: "36px 56px",
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 20 } },
      boutique.logo_url
        ? h("img", {
            src: boutique.logo_url,
            width: 64,
            height: 64,
            style: { borderRadius: 14, objectFit: "cover" },
          })
        : null,
      h("div", { style: { fontSize: 34, fontWeight: 700, color: "#ffffff" } }, boutique.nom),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } },
      h(
        "div",
        {
          style: {
            fontSize: 20,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 2,
          },
        },
        libelle,
      ),
      h(
        "div",
        { style: { fontSize: 18, color: COULEURS.accentClair, marginTop: 6 } },
        `N° ${numero} · ${date}`,
      ),
    ),
  );
}

export function construirePiedDePageDocument(boutique: Boutique, message: string) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "28px 56px",
        borderTop: `2px solid ${COULEURS.bordure}`,
      },
    },
    h("div", { style: { fontSize: 20, fontWeight: 700, color: COULEURS.texte } }, boutique.nom),
    h("div", { style: { fontSize: 16, color: COULEURS.texteMuted } }, message),
  );
}

export function construireLigneDetail(label: string, valeur: string, accent = false) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: accent ? 26 : 20,
        fontWeight: accent ? 700 : 400,
        color: accent ? COULEURS.accent : COULEURS.texte,
      },
    },
    h("div", {}, label),
    h("div", {}, valeur),
  );
}

export function construireCarte(titre: string, enfants: ReactNode[]) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        backgroundColor: COULEURS.carte,
        border: `2px solid ${COULEURS.bordure}`,
        borderRadius: 20,
        padding: 28,
      },
    },
    h(
      "div",
      {
        style: {
          fontSize: 18,
          fontWeight: 700,
          color: COULEURS.texteMuted,
          textTransform: "uppercase",
          letterSpacing: 1,
        },
      },
      titre,
    ),
    ...enfants,
  );
}

export { formatFcfa };
