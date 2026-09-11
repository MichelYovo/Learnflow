import Image from "next/image";
import Link from "next/link";
import ActivityCharts from "@/components/ActivityCharts";
import ActivityFeed from "@/components/ActivityFeed";
import StatCard from "@/components/StatCard";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { classLabel, initialsFromName, LEAGUE_TIERS } from "@/lib/brand";
import { loadDashboardData } from "@/lib/catalog";
import { listSupportMessages } from "@/lib/supportInbox";

export default async function DashboardPage() {
  const session = await getAdminSession();
  const data = await loadDashboardData();
  const inbox = await listSupportMessages();
  const top = data.students.slice().sort((a, b) => b.xpTotale - a.xpTotale).slice(0, 6);

  return (
    <>
      <TopBar title="Vue d’ensemble" email={session?.email ?? ""} />
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#64748B]">
            Source : {data.source === "cloud" ? "Supabase (élèves réels)" : "Supabase non configuré"}
            {data.cloudError ? ` · ${data.cloudError}` : ""}
          </p>
        </div>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Élèves" value={String(data.stats.students)} hint="Profils suivis" tone="blue" />
          <StatCard label="Actifs 24 h" value={String(data.stats.active24h)} hint="Mouvements récents" tone="green" />
          <Link href="/dashboard/relances">
            <StatCard
              label="Inactifs"
              value={String(data.stats.inactive)}
              hint="À relancer par mail"
              tone="red"
            />
          </Link>
          <Link href="/dashboard/parents">
            <StatCard
              label="Parents"
              value={String(data.students.filter((s) => s.parentPhone).length)}
              hint="WhatsApp suivi"
              tone="violet"
            />
          </Link>
        </section>

        <ActivityCharts stats={data.stats} />

        <ActivityFeed events={data.events.slice(0, 8)} />

        <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black text-[#1C1917]">Messages du site vitrine</h2>
            <Link href="/dashboard/messages" className="text-sm font-extrabold text-[#1677FF]">
              Tout voir
            </Link>
          </div>
          {inbox.data.length === 0 ? (
            <p className="text-sm font-medium text-[#64748B]">Aucun message pour l’instant.</p>
          ) : (
            <ul className="space-y-3">
              {inbox.data.slice(0, 4).map((m) => (
                <li key={m.id} className="rounded-2xl border border-[#F0EFEE] px-4 py-3">
                  <p className="font-extrabold text-[#1C1917]">
                    {m.name}{" "}
                    <span className="text-xs font-semibold text-[#64748B]">{m.email}</span>
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-[#64748B]">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-black text-[#1C1917]">Top élèves</h2>
              <Link href="/dashboard/eleves" className="text-sm font-extrabold text-[#1677FF]">
                Voir tous
              </Link>
            </div>
            <ul className="space-y-3">
              {top.map((s, i) => (
                <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-[#F0EFEE] px-3 py-2.5">
                  <Link href={`/dashboard/eleves/${s.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-6 text-sm font-black text-[#A8A29E]">{i + 1}</span>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ background: s.color }}
                  >
                    {initialsFromName(s.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold text-[#1C1917]">{s.name}</p>
                    <p className="text-xs font-semibold text-[#64748B]">{classLabel(s.classe)} · {s.leagueTier}</p>
                  </div>
                  <p className="font-black text-[#1677FF]">{s.xpTotale.toLocaleString("fr-FR")} XP</p>
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
            <h2 className="mb-4 text-base font-black text-[#1C1917]">Répartition des ligues</h2>
            <ul className="space-y-3">
              {data.stats.byTier.map((tier) => {
                const meta = LEAGUE_TIERS.find((t) => t.id === tier.id);
                const max = Math.max(...data.stats.byTier.map((t) => t.count), 1);
                return (
                  <li key={tier.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-bold text-[#1C1917]">
                        {meta ? (
                          <Image src={meta.badge} alt="" width={22} height={22} className="h-5 w-5 object-contain" />
                        ) : null}
                        {tier.label}
                      </span>
                      <span className="font-extrabold text-[#64748B]">{tier.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F0EFEE]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(tier.count / max) * 100}%`, background: tier.color }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link href="/dashboard/ligues" className="mt-5 inline-block text-sm font-extrabold text-[#1677FF]">
              Ouvrir les ligues
            </Link>
          </article>
        </section>

        <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
          <h2 className="mb-4 text-base font-black text-[#1C1917]">Élèves par classe</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {data.stats.byClass.map((c) => (
              <div key={c.id} className="rounded-2xl bg-[#FAFAF9] p-4 text-center">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#64748B]">{c.label}</p>
                <p className="mt-1 text-2xl font-black text-[#1C1917]">{c.count}</p>
              </div>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
