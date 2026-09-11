"use client";

import Link from "next/link";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-black">L’accueil n’a pas pu s’ouvrir</h1>
      <p className="max-w-md text-sm font-medium text-zinc-500">
        Réessaie. Si ça continue, repars de l’onboarding.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white"
        >
          Réessayer
        </button>
        <Link href="/onboarding" className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-extrabold text-zinc-800">
          Revenir à l’accueil
        </Link>
      </div>
    </div>
  );
}
