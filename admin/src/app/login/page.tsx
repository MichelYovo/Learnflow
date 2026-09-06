import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion de l’administrateur unique LearnFlow.",
};

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/dashboard");

  return (
    <div className="grid min-h-full lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-[#0F172A] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_320px_at_20%_-10%,rgba(22,119,255,.45),transparent),radial-gradient(500px_240px_at_90%_80%,rgba(16,185,129,.18),transparent)]" />
        <Image src="/brand/logo-dark.png" alt="LearnFlow" width={180} height={42} className="relative h-10 w-auto" />
        <div className="relative max-w-md">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white/80">
            Administrateur unique
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white">
            L’espace qui pilote LearnFlow.
          </h1>
          <p className="mt-4 text-base font-medium leading-relaxed text-white/70">
            Suivi des élèves, ligues, programme APC Togo. Un seul identifiant, un seul mot de passe — pas d’inscription
            publique.
          </p>
        </div>
        <p className="relative text-sm font-semibold text-white/45">Togo · collège & lycée · offline-first</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/brand/logo-light.png" alt="LearnFlow" width={168} height={40} className="h-9 w-auto" />
          </div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Espace admin</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#1C1917]">Bon retour.</h2>
          <p className="mt-2 text-sm font-medium text-[#64748B]">
            Connecte-toi avec l’identifiant administrateur unique.
          </p>
          <div className="mt-8 rounded-[28px] border-2 border-[#F0EFEE] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,.06)]">
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
