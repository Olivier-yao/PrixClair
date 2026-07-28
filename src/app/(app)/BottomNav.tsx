"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

function IconBoutique(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9h14v-9" />
      <path d="M9.5 19v-5h5v5" />
    </svg>
  );
}

function IconProduits(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3h6a2 2 0 0 1 2 2v6l-9.5 9.5a1.5 1.5 0 0 1-2 0l-6-6a1.5 1.5 0 0 1 0-2Z" />
      <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLivraison(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1.5" y="7" width="12.5" height="9" rx="1" />
      <path d="M14 10h4l3.5 3.2V16h-2" />
      <circle cx="6" cy="18.2" r="1.6" />
      <circle cx="16.5" cy="18.2" r="1.6" />
    </svg>
  );
}

function IconNouvelleVente(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function IconHistorique(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

const ONGLETS = [
  { href: "/boutique", label: "Boutique", Icone: IconBoutique },
  { href: "/produits", label: "Produits", Icone: IconProduits },
  { href: "/vente", label: "Vente", Icone: IconNouvelleVente, mise_en_avant: true },
  { href: "/livraison", label: "Livraison", Icone: IconLivraison },
  { href: "/ventes", label: "Historique", Icone: IconHistorique },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-orange-100 bg-white pb-[env(safe-area-inset-bottom)] dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="mx-auto flex max-w-sm items-stretch justify-between px-2">
        {ONGLETS.map(({ href, label, Icone, mise_en_avant }) => {
          const actif = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={actif ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                actif ? "text-orange-700 dark:text-orange-400" : "text-stone-500 dark:text-stone-400"
              }`}
            >
              <span
                className={
                  mise_en_avant
                    ? `flex h-10 w-10 items-center justify-center rounded-full ${
                        actif ? "bg-orange-700 text-white" : "bg-orange-100 text-orange-700 dark:bg-stone-800"
                      }`
                    : ""
                }
              >
                <Icone className="h-6 w-6" />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
