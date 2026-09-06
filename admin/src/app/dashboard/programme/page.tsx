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
          Catalogue pédagogique aligné sur l’app mobile : collège (maquette 3ème) et lycée (Tle D). Les 7 matières
          suivent le programme APC Togo.
        </p>
        <ProgrammeBrowser />
      </main>
    </>
  );
}
