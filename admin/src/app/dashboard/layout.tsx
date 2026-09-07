import { redirect } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import SuperProfChat from "@/components/SuperProfChat";
import { getAdminSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        {children}
      </div>
      <SuperProfChat />
    </div>
  );
}
