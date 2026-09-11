"use client";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-lg font-black text-[#1C1917]">Cette page n’a pas pu se charger</h1>
      <p className="max-w-md text-sm font-medium text-[#64748B]">
        Les données élèves / Supabase ont bloqué le rendu. Recharge sans quitter l’admin.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white"
      >
        Réessayer
      </button>
    </main>
  );
}
