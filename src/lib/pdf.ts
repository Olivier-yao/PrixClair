import { PDFDocument } from "pdf-lib";

// Encapsule une image PNG (deja mise en page, generee via next/og) dans un
// PDF d'une page a sa taille exacte : plus simple et plus fiable que de
// recomposer la mise en page avec les API texte bas-niveau de pdf-lib.
export async function pngVersPdf(pngBuffer: Buffer, largeur: number, hauteur: number): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const image = await pdf.embedPng(pngBuffer);
  const page = pdf.addPage([largeur, hauteur]);
  page.drawImage(image, { x: 0, y: 0, width: largeur, height: hauteur });
  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
