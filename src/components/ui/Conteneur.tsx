export function Conteneur({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center bg-orange-50 px-6 py-8 dark:bg-stone-950">
      <main className="w-full max-w-sm space-y-6">{children}</main>
    </div>
  );
}
