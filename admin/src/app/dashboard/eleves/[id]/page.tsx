import { notFound } from "next/navigation";
import StudentDetail from "@/components/StudentDetail";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { loadStudentDetail } from "@/lib/catalog";

export default async function ElevePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  const { id } = await params;
  const data = await loadStudentDetail(id);
  if (!data.student) notFound();

  return (
    <>
      <TopBar title={data.student.name} email={session?.email ?? ""} />
      <main className="flex-1 p-6">
        <StudentDetail student={data.student} events={data.events} league={data.league} />
      </main>
    </>
  );
}
