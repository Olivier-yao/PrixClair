// Redimensionne et compresse une photo cote navigateur avant l'upload,
// pour rester tolerant aux connexions lentes (cf. contraintes du brief).
export async function compresserImage(
  fichier: File,
  dimensionMax = 1600,
  qualite = 0.8,
): Promise<Blob> {
  const bitmap = await createImageBitmap(fichier);

  const ratio = Math.min(1, dimensionMax / Math.max(bitmap.width, bitmap.height));
  const largeur = Math.round(bitmap.width * ratio);
  const hauteur = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = largeur;
  canvas.height = hauteur;

  const contexte = canvas.getContext("2d");
  if (!contexte) throw new Error("Compression impossible sur ce navigateur.");
  contexte.drawImage(bitmap, 0, 0, largeur, hauteur);

  return await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compression echouee."))),
      "image/jpeg",
      qualite,
    );
  });
}
