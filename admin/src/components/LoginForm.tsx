"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Connexion impossible.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Réseau indisponible. Réessaie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-[#1C1917]">
          Identifiant
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@learnflow.tg"
          required
          className="h-12 w-full rounded-2xl border-2 border-[#F0EFEE] bg-white px-4 text-sm font-medium text-[#1C1917] outline-none transition placeholder:text-[#A8A29E] focus:border-[#1677FF]"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-[#1C1917]">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            className="h-12 w-full rounded-2xl border-2 border-[#F0EFEE] bg-white px-4 pr-12 text-sm font-medium text-[#1C1917] outline-none transition placeholder:text-[#A8A29E] focus:border-[#1677FF]"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute inset-y-0 right-3 text-xs font-extrabold text-[#1677FF]"
          >
            {showPw ? "Cacher" : "Voir"}
          </button>
        </div>
      </div>
      {error ? (
        <p className="rounded-xl border-2 border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm font-semibold text-[#EF4444]">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#1677FF] text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(22,119,255,.28)] transition hover:bg-[#155EEF] disabled:opacity-60"
      >
        {busy ? "Connexion…" : "Entrer dans l’espace admin"}
      </button>
    </form>
  );
}
