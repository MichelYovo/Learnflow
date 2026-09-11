import StudentsTable from "@/components/StudentsTable";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { loadDashboardData } from "@/lib/catalog";

export default async function ElevesPage() {
  const session = await getAdminSession();
  const data = await loadDashboardData();

  return (
    <>
      <TopBar title="Élèves" email={session?.email ?? ""} />
      <main className="flex-1 p-6">
        <p className="mb-5 text-sm font-medium text-[#64748B]">
          {data.students.length} profils · source {data.source === "cloud" ? "Supabase" : "non configuré"}
          {data.cloudError ? ` · ${data.cloudError}` : ""}
        </p>
        <StudentsTable students={data.students} />
      </main>
    </>
  );
}
