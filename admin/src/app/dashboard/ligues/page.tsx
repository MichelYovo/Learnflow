import Image from "next/image";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { initialsFromName, LEAGUE_TIERS } from "@/lib/brand";
import { loadDashboardData } from "@/lib/catalog";

export default async function LiguesPage() {
  const session = await getAdminSession();
  const data = await loadDashboardData();

  return (
    <>
      <TopBar title="Ligues" email={session?.email ?? ""} />
      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-3 sm:grid-cols-5">
          {LEAGUE_TIERS.map((tier) => {
            const count = data.leagues.filter((l) => l.tier === tier.id).length;
            return (
              <article key={tier.id} className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-4 text-center">
                <Image src={tier.badge} alt={tier.label} width={48} height={48} className="mx-auto h-12 w-12 object-contain" />
                <p className="mt-2 font-black text-[#1C1917]">{tier.label}</p>
                <p className="text-sm font-bold text-[#64748B]">{count} élève{count > 1 ? "s" : ""}</p>
              </article>
            );
          })}
        </div>
        <article className="overflow-hidden rounded-[22px] border-2 border-[#F0EFEE] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAF9] text-[11px] font-extrabold uppercase tracking-wider text-[#A8A29E]">
              <tr>
                <th className="px-4 py-3">Rang</th>
                <th className="px-4 py-3">Élève</th>
                <th className="px-4 py-3">Palier</th>
                <th className="px-4 py-3">XP semaine</th>
              </tr>
            </thead>
            <tbody>
              {data.leagues.map((row) => (
                <tr key={row.studentId} className="border-t border-[#F0EFEE]">
                  <td className="px-4 py-3 font-black text-[#A8A29E]">#{row.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white"
                        style={{ background: row.color }}
                      >
                        {initialsFromName(row.name)}
                      </span>
                      <span className="font-extrabold text-[#1C1917]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold">{row.tier}</td>
                  <td className="px-4 py-3 font-black text-[#1677FF]">{row.weeklyXp.toLocaleString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </main>
    </>
  );
}
