import ProgrammeBrowser from "@/components/ProgrammeBrowser";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";

export default async function ProgrammePage() {
  const session = await getAdminSession();

  return (
    <>
      <TopBar title="Programme APC" email={session?.email ?? ""} />
      <main className="flex-1 p-6">
        <p className="mb-5 max-w-2xl text-sm font-medium leading-relaxed text-[#64748B]">
          Catalogue : collège (6e–3e, PCT). Lycée : les cours de Données_LF sont chargés pour la Tle D seulement. Les autres classes lycée n’ont pas encore de cours.
        </p>
        <ProgrammeBrowser />
      </main>
    </>
  );
}
