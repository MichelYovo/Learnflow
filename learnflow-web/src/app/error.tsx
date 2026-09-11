"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("LearnFlow page error", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-black">La page n’a pas pu se charger</h1>
      <p className="max-w-md text-sm font-medium text-zinc-500">
        Un souci a bloqué cette page. Réessaie, ou repars de l’accueil.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white"
        >
          Réessayer
        </button>
        <Link
          href="/onboarding"
          className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-extrabold text-zinc-800"
        >
          Revenir à l’accueil
        </Link>
      </div>
    </div>
  );
}
