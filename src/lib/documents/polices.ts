import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Police monospace type machine a ecrire pour l'esthetique "ticket de caisse"
// du recu. Chargee localement (pas d'appel reseau a l'execution).
export async function chargerPoliceRecu() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "src/lib/documents/fonts/CourierPrime-Regular.ttf")),
    readFile(join(process.cwd(), "src/lib/documents/fonts/CourierPrime-Bold.ttf")),
  ]);

  return [
    { name: "Courier Prime", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Courier Prime", data: bold, style: "normal" as const, weight: 700 as const },
  ];
}
