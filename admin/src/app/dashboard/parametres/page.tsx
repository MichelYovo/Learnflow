import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default async function SettingsPage() {
  const session = await getAdminSession();

  return (
    <>
      <TopBar title="Paramètres" email={session?.email ?? ""} />
      <main className="flex-1 space-y-5 p-6">
        <article className="max-w-xl rounded-[22px] border-2 border-[#F0EFEE] bg-white p-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Compte unique</p>
          <h2 className="mt-1 text-xl font-black text-[#1C1917]">Administrateur LearnFlow</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-[#F0EFEE] pb-3">
              <dt className="font-semibold text-[#64748B]">Identifiant</dt>
              <dd className="font-extrabold text-[#1C1917]">{session?.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#F0EFEE] pb-3">
              <dt className="font-semibold text-[#64748B]">Rôle</dt>
              <dd className="font-extrabold text-[#1C1917]">Administrateur unique</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-[#64748B]">Cloud Supabase</dt>
              <dd className="font-extrabold text-[#1C1917]">{isSupabaseConfigured ? "Connecté" : "Non configuré"}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm font-medium leading-relaxed text-[#64748B]">
            Ce site n’accepte pas d’inscription. L’email et le mot de passe se changent uniquement via les variables
            d’environnement <code className="font-mono text-xs">ADMIN_EMAIL</code> et{" "}
            <code className="font-mono text-xs">ADMIN_PASSWORD</code>.
          </p>
        </article>
      </main>
    </>
  );
}
