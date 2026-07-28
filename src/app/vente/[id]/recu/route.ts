import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { getBoutique } from "@/lib/data/boutiques";
import { obtenirVente } from "@/lib/data/ventes";
import { construireRecuPaiement } from "@/lib/documents/recu";
import { DIMENSIONS_DOCUMENT } from "@/lib/documents/commun";
import { pngVersPdf } from "@/lib/pdf";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Non authentifie.", { status: 401 });

  const vente = await obtenirVente(id);
  if (!vente) return new Response("Vente introuvable.", { status: 404 });

  const boutique = await getBoutique();
  if (!boutique) return new Response("Boutique introuvable.", { status: 404 });

  const { width, height } = DIMENSIONS_DOCUMENT;
  const image = new ImageResponse(construireRecuPaiement(boutique, vente), { width, height });
  const pngBuffer = Buffer.from(await image.arrayBuffer());
  const pdfBuffer = await pngVersPdf(pngBuffer, width, height);

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="recu-${vente.numero}.pdf"`,
    },
  });
}
