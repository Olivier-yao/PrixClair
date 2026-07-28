// Genere le bord festonne (encoches en demi-cercle) en haut du ticket, en
// SVG encode en data-URI : plus simple et fiable que d'essayer de decouper
// une forme avec les capacites CSS limitees de Satori.
export function bordureFestonnee(largeur: number, couleurFond: string, diametre = 32): string {
  const nombre = Math.ceil(largeur / diametre) + 1;
  const cercles = Array.from(
    { length: nombre },
    (_, i) => `<circle cx="${i * diametre + diametre / 2}" cy="0" r="${diametre / 2}" fill="${couleurFond}" />`,
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${diametre / 2}" viewBox="0 0 ${largeur} ${diametre / 2}">${cercles}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Code-barres purement decoratif (barres de largeur pseudo-aleatoire mais
// deterministe a partir du numero de vente) : le numero lisible en dessous
// est la vraie reference, pas les barres.
export function codeBarresDecoratif(numero: string, largeur: number, hauteur: number, couleur: string): string {
  let graine = 0;
  for (const car of numero) graine = (graine * 31 + car.charCodeAt(0)) % 997;

  const barres: string[] = [];
  let x = 0;
  while (x < largeur) {
    graine = (graine * 1103515245 + 12345) % 2147483648;
    const largeurBarre = 2 + (graine % 5);
    const plein = graine % 3 !== 0;
    if (plein) {
      barres.push(`<rect x="${x}" y="0" width="${largeurBarre}" height="${hauteur}" fill="${couleur}" />`);
    }
    x += largeurBarre + 2;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${hauteur}" viewBox="0 0 ${largeur} ${hauteur}">${barres.join("")}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
