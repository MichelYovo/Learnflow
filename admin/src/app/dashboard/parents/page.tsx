import ParentStudio from "@/components/ParentStudio";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { classLabel } from "@/lib/brand";
import { loadDashboardData } from "@/lib/catalog";
import {
  lastRecapAt,
  lastWelcomeAt,
  loadParentSends,
  loadParentSettings,
  needsRecap,
  needsWelcome,
  parentDraft,
} from "@/lib/parentNotify";
import { parentPhoneStatus } from "@/lib/phoneTogo";
import { fetchLoginNotices } from "@/lib/supabase";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

export default async function ParentsPage() {
  const session = await getAdminSession();
  const data = await loadDashboardData();
  const notices = (await fetchLoginNotices()).data ?? [];
  const settings = loadParentSettings();
  const students = data.students.map((s) => {
    const status = parentPhoneStatus(s.parentPhone);
    return {
      id: s.id,
      name: s.name,
      classLabel: classLabel(s.classe),
      parentPhone: s.parentPhone,
      phoneStatus: status,
      welcomeDue: needsWelcome(s, notices),
      recapDue: needsRecap(s, notices, settings.cadenceDays),
      lastWelcomeAt: lastWelcomeAt(s.id, notices),
      lastRecapAt: lastRecapAt(s.id, notices),
      welcomeLink: status === "ok" ? parentDraft(s, "parent_welcome", settings.cadenceDays).waLink : "",
      recapLink: status === "ok" ? parentDraft(s, "weekly_recap", settings.cadenceDays).waLink : "",
    };
  });

  return (
    <>
      <TopBar title="Parents" email={session?.email ?? ""} />
      <main className="flex-1 space-y-5 p-6">
        <p className="text-sm font-medium text-[#64748B]">
          Vérification des numéros déjà inscrits · envoi WhatsApp gratuit via ton téléphone (wa.me), sans API payante.
        </p>
        <ParentStudio
          cadenceDays={settings.cadenceDays}
          whatsappReady={isWhatsAppConfigured()}
          students={students}
          sends={loadParentSends().slice(0, 24)}
        />
      </main>
    </>
  );
}
