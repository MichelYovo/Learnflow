"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-black">La page n’a pas pu se charger</h1>
      <p className="max-w-md text-sm font-medium text-zinc-500">
        Un souci est arrivé côté serveur. Réessaie, ou ouvre LearnFlow dans Chrome si tu es dans l’aperçu Cursor.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white"
      >
        Réessayer
      </button>
    </div>
  );
}
