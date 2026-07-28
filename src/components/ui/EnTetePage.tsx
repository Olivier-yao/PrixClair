export function EnTetePage({ titre, sousTitre }: { titre: string; sousTitre?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">{titre}</h1>
      {sousTitre && <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{sousTitre}</p>}
    </div>
  );
}
