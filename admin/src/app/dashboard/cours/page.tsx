import ProfStudio from "@/components/ProfStudio";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";

export default async function CoursPage() {
  const session = await getAdminSession();
  return (
    <>
      <TopBar title="Cours / Prof" email={session?.email ?? ""} />
      <main className="flex-1 p-6">
        <p className="mb-5 max-w-2xl text-sm font-medium leading-relaxed text-[#64748B]">
          Dépose un PDF, une image (photo de cahier, capture) ou colle le texte. Prof résume, prépare les quiz, tu corriges, puis tu publies.
          Rien n’arrive aux élèves tant que tu n’as pas cliqué sur Envoyer.
        </p>
        <ProfStudio />
      </main>
    </>
  );
}
