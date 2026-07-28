import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { getBoutique } from "@/lib/data/boutiques";
import { listerProduits } from "@/lib/data/produits";
import { construireCatalogueImage } from "@/lib/catalogue/contenu";

const DIMENSIONS = {
  story: { width: 1080, height: 1920 },
  carre: { width: 1080, height: 1080 },
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ format: string }> },
) {
  const { format } = await params;
  if (format !== "story" && format !== "carre") {
    return new Response("Format invalide.", { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Non authentifie.", { status: 401 });

  const boutique = await getBoutique();
  if (!boutique) return new Response("Boutique introuvable.", { status: 404 });

  const produits = await listerProduits(boutique.id);

  return new ImageResponse(construireCatalogueImage(boutique, produits), DIMENSIONS[format]);
}
