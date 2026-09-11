import RelanceStudio from "@/components/RelanceStudio";
import EditorNoticePanel from "@/components/EditorNoticePanel";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { loadDashboardData } from "@/lib/catalog";
import { INACTIVITY_DAYS, inactiveStudents } from "@/lib/inactivity";
import { isMailConfigured } from "@/lib/mail";
import { loadRelanceSends, loadRelanceTemplate } from "@/lib/relance";

export default async function RelancesPage() {
  const session = await getAdminSession();
  const data = await loadDashboardData();
  const inactifs = inactiveStudents(data.students, data.events);
  const template = loadRelanceTemplate();
  const sends = loadRelanceSends();

  return (
    <>
      <TopBar title="Relances" email={session?.email ?? ""} />
      <main className="flex-1 space-y-5 p-6">
        <p className="text-sm font-medium text-[#64748B]">
          {inactifs.length} élève{inactifs.length > 1 ? "s" : ""} sans activité depuis {INACTIVITY_DAYS} jours · Super
          Prof peut rédiger le mail, tu valides l’envoi.
        </p>
        <EditorNoticePanel />
        <RelanceStudio students={inactifs} template={template} sends={sends} mailReady={isMailConfigured()} />
      </main>
    </>
  );
}
