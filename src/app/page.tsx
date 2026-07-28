const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          PrixClair
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Setup du projet en cours. Cette page confirme que tout est branche.
        </p>

        <ul className="mt-6 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <StatusDot ok />
            Next.js + Tailwind CSS
          </li>
          <li className="flex items-center gap-2">
            <StatusDot ok={supabaseConfigured} />
            Connexion Supabase configuree
          </li>
        </ul>
      </main>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        ok ? "bg-green-500" : "bg-red-500"
      }`}
    />
  );
}
