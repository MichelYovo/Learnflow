"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#FAFAF9] p-6 text-center">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#1677FF]">LearnFlow Admin</p>
      <h1 className="text-xl font-black text-[#1C1917]">La page n’a pas pu se charger</h1>
      <p className="max-w-md text-sm font-medium text-[#64748B]">
        Le back-office a planté pendant le chargement des données. Un second essai suffit souvent.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white"
      >
        Recharger
      </button>
    </div>
  );
}
