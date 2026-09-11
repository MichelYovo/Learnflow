import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { isMailConfigured } from "@/lib/mail";
import { adminHasGemini, cloudStatusLabel, isAdminCloudReady, isSupabaseConfigured } from "@/lib/supabase";

export default async function SettingsPage() {
  const session = await getAdminSession();
  const groqOk = Boolean(process.env.GROQ_API_KEY?.trim());

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
            <div className="flex justify-between gap-4 border-b border-[#F0EFEE] pb-3">
              <dt className="font-semibold text-[#64748B]">Cloud Supabase</dt>
              <dd className="font-extrabold text-[#1C1917]">{cloudStatusLabel()}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#F0EFEE] pb-3">
              <dt className="font-semibold text-[#64748B]">Gemini (Super Prof)</dt>
              <dd className="font-extrabold text-[#1C1917]">{adminHasGemini() ? "GEMINI_API_KEY ok" : "Clé absente"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#F0EFEE] pb-3">
              <dt className="font-semibold text-[#64748B]">Groq (Prof / cours)</dt>
              <dd className="font-extrabold text-[#1C1917]">{groqOk ? "GROQ_API_KEY ok" : "Clé absente"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-[#64748B]">Mails de relance</dt>
              <dd className="font-extrabold text-[#1C1917]">{isMailConfigured() ? "SMTP / Resend ok" : "Non configuré"}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm font-medium leading-relaxed text-[#64748B]">
            {isSupabaseConfigured && !isAdminCloudReady
              ? "La lecture élèves a besoin de SUPABASE_SECRET_KEY (service_role), pas seulement la clé anon."
              : "Super Prof rédige et envoie les relances. Prof (cours) et schémas restent sur Groq. Les clés ne sont jamais exposées au navigateur."}
          </p>
        </article>
      </main>
    </>
  );
}
