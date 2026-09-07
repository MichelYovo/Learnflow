import ActivityTable from "@/components/ActivityTable";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { loadDashboardData } from "@/lib/catalog";

export default async function ActivitePage() {
  const session = await getAdminSession();
  const data = await loadDashboardData();

  return (
    <>
      <TopBar title="Activité live" email={session?.email ?? ""} />
      <main className="flex-1 p-6">
        <p className="mb-5 text-sm font-medium text-[#64748B]">
          {data.events.length} mouvements · source {data.source === "cloud" ? "Supabase (web + mobile)" : "locale (démo)"}
        </p>
        <ActivityTable events={data.events} />
      </main>
    </>
  );
}
