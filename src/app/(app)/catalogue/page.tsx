import Image from "next/image";
import { redirect } from "next/navigation";
import { getBoutique } from "@/lib/data/boutiques";

export default async function CataloguePage() {
  const boutique = await getBoutique();
  if (!boutique) redirect("/boutique");

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-8 dark:bg-black">
      <main className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Catalogue</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Genere a partir de tes produits et de ta livraison. Regenere apres chaque
            modification.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Format story (1080x1920)
          </h2>
          <Image
            src="/catalogue/image/story"
            alt="Apercu catalogue format story"
            width={1080}
            height={1920}
            unoptimized
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
          />
          <a
            href="/catalogue/image/story"
            download="catalogue-story.png"
            className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-base font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
          >
            Telecharger (story)
          </a>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Format post carre (1080x1080)
          </h2>
          <Image
            src="/catalogue/image/carre"
            alt="Apercu catalogue format carre"
            width={1080}
            height={1080}
            unoptimized
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
          />
          <a
            href="/catalogue/image/carre"
            download="catalogue-carre.png"
            className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-base font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
          >
            Telecharger (carre)
          </a>
        </section>
      </main>
    </div>
  );
}
