// Classes Tailwind partagees pour une apparence coherente sur tout le site,
// reprenant l'identite visuelle chaude (orange) des documents generes.
export const champ =
  "w-full rounded-lg border-2 border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/30 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100";

export const etiquette = "block text-sm font-semibold text-stone-800 dark:text-stone-200";

export const carte =
  "rounded-2xl border border-orange-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900";

// orange-700 (pas 600) pour un contraste texte blanc conforme aux
// standards d'accessibilite (WCAG AA).
export const boutonPrimaire =
  "w-full rounded-lg bg-orange-700 px-4 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-orange-800 disabled:opacity-50 disabled:hover:bg-orange-700";

export const boutonSecondaire =
  "w-full rounded-lg border-2 border-stone-300 px-4 py-3.5 text-center text-base font-semibold text-stone-800 transition-colors hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800";

export const lienDiscret =
  "text-sm font-medium text-stone-600 underline underline-offset-2 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200";

export const erreurTexte = "text-sm text-red-600 dark:text-red-400";
export const succesTexte = "text-sm text-green-700 dark:text-green-500";
