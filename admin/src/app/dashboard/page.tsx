import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ActivityCharts from "@/components/ActivityCharts";
import ActivityFeed from "@/components/ActivityFeed";
import StatCard from "@/components/StatCard";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { classLabel, initialsFromName, LEAGUE_TIERS } from "@/lib/brand";
import { loadDashboardData } from "@/lib/catalog";
import { listSupportMessages } from "@/lib/supportInbox";

const CARD = "rounded-[24px] border border-[#E7E5E4] bg-white p-5 shadow-[0_12px_32px_rgba(28,25,23,.045)]";

const RANK = [
  "bg-[#FEF3C7] text-[#B45309]",
  "bg-[#F1F5F9] text-[#475569]",
  "bg-[#FFEDD5] text-[#C2410C]",
];

export default async function DashboardPage() {
  const session = await getAdminSession();
  const data = await loadDashboardData();
  const inbox = await listSupportMessages();
  const top = data.students.slice().sort((a, b) => b.xpTotale - a.xpTotale).slice(0, 6);
  const parents = data.students.filter((s) => s.parentPhone).length;
  const unread = inbox.data.filter((m) => m.status === "new").length;
  const { greeting, dateLabel } = lomeGreeting();
  const cloudOk = data.source === "cloud" && !data.cloudError;
  const classMax = Math.max(...data.stats.byClass.map((c) => c.count), 1);

  return (
    <>
      <TopBar title="Vue d’ensemble" email={session?.email ?? ""} />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="relative overflow-hidden rounded-[28px] bg-[#0B1220] px-6 py-7 text-white shadow-[0_24px_50px_rgba(15,23,42,.16)] sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_280px_at_0%_-20%,rgba(22,119,255,.5),transparent),radial-gradient(420px_220px_at_100%_120%,rgba(16,185,129,.22),transparent)]" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#1677FF]/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/55">{dateLabel}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{greeting}.</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                {data.stats.students.toLocaleString("fr-FR")} élèves suivis · {data.stats.active24h} actifs sur 24 h ·{" "}
                {data.stats.activeStreaks} séries de 3 jours
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${
                  cloudOk ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-300/15 text-amber-100"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cloudOk ? "bg-emerald-300" : "bg-amber-300"}`} />
                {cloudOk ? "Données en direct · Supabase" : "Supabase non configuré"}
              </span>
              <div className="flex flex-wrap gap-2">
                <HeroLink href="/dashboard/eleves">Élèves</HeroLink>
                <HeroLink href="/dashboard/relances" emphasis={data.stats.inactive > 0}>
                  {data.stats.inactive > 0 ? `${data.stats.inactive} à relancer` : "Relances"}
                </HeroLink>
                <HeroLink href="/dashboard/messages">
                  {unread > 0 ? `${unread} message${unread > 1 ? "s" : ""}` : "Messages"}
                </HeroLink>
              </div>
            </div>
          </div>
        </section>

        {data.cloudError ? (
          <p className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm font-semibold text-[#92400E]">
            {data.cloudError}
          </p>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Élèves"
            value={data.stats.students.toLocaleString("fr-FR")}
            hint="Profils suivis"
            tone="blue"
            icon={<UsersIcon />}
          />
          <StatCard
            label="XP total"
            value={data.stats.xpTotal.toLocaleString("fr-FR")}
            hint={`Moyenne ${data.stats.avgXp.toLocaleString("fr-FR")}`}
            tone="amber"
            icon={<SparkIcon />}
          />
          <StatCard
            label="Actifs 24 h"
            value={String(data.stats.active24h)}
            hint="Connexions et sync"
            tone="green"
            icon={<PulseIcon />}
          />
          <Link href="/dashboard/relances" className="block h-full rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677FF]">
            <StatCard
              label="Inactifs"
              value={String(data.stats.inactive)}
              hint="À relancer par mail"
              tone="red"
              icon={<BellIcon />}
            />
          </Link>
          <Link href="/dashboard/parents" className="block h-full rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677FF]">
            <StatCard
              label="Parents"
              value={String(parents)}
              hint="WhatsApp suivi"
              tone="violet"
              icon={<ChatIcon />}
            />
          </Link>
        </section>

        <ActivityCharts stats={data.stats} />

        <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
          <ActivityFeed events={data.events.slice(0, 8)} />

          <article className={CARD}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-black tracking-tight text-[#1C1917]">Messages du site</h2>
                <p className="mt-0.5 text-xs font-semibold text-[#A8A29E]">
                  {unread > 0 ? `${unread} non lu${unread > 1 ? "s" : ""}` : "Boîte à jour"}
                </p>
              </div>
              <Link href="/dashboard/messages" className="text-sm font-extrabold text-[#1677FF] hover:text-[#155EEF]">
                Tout voir
              </Link>
            </div>
            {inbox.data.length === 0 ? (
              <p className="rounded-2xl bg-[#FAFAF9] px-4 py-8 text-center text-sm font-semibold text-[#A8A29E]">
                Aucun message pour l’instant.
              </p>
            ) : (
              <ul className="space-y-2">
                {inbox.data.slice(0, 4).map((m) => (
                  <li key={m.id}>
                    <Link
                      href="/dashboard/messages"
                      className="flex items-start gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-[#FAFAF9]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6F4FF] text-[11px] font-black text-[#1677FF]">
                        {initialsFromName(m.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2">
                          <span className="truncate font-extrabold text-[#1C1917]">{m.name}</span>
                          {m.status === "new" ? (
                            <span className="shrink-0 rounded-full bg-[#E6F4FF] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#1677FF]">
                              Nouveau
                            </span>
                          ) : null}
                        </p>
                        <p className="truncate text-xs font-semibold text-[#A8A29E]">{m.email}</p>
                        <p className="mt-1 line-clamp-2 text-sm font-medium text-[#64748B]">{m.message}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <article className={CARD}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-black tracking-tight text-[#1C1917]">Top élèves</h2>
              <Link href="/dashboard/eleves" className="text-sm font-extrabold text-[#1677FF] hover:text-[#155EEF]">
                Voir tous
              </Link>
            </div>
            {top.length === 0 ? (
              <p className="rounded-2xl bg-[#FAFAF9] px-4 py-8 text-center text-sm font-semibold text-[#A8A29E]">
                Aucun élève pour l’instant.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {top.map((s, i) => (
                  <li key={s.id}>
                    <Link
                      href={`/dashboard/eleves/${s.id}`}
                      className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-[#FAFAF9]"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                          RANK[i] ?? "bg-[#F5F5F4] text-[#A8A29E]"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{ background: s.color }}
                      >
                        {initialsFromName(s.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold text-[#1C1917]">{s.name}</p>
                        <p className="text-xs font-semibold text-[#64748B]">
                          {classLabel(s.classe)} · {s.leagueTier}
                        </p>
                      </div>
                      <p className="shrink-0 font-black text-[#1677FF]">{s.xpTotale.toLocaleString("fr-FR")} XP</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className={CARD}>
            <h2 className="mb-4 text-[15px] font-black tracking-tight text-[#1C1917]">Répartition des ligues</h2>
            <ul className="space-y-3.5">
              {data.stats.byTier.map((tier) => {
                const meta = LEAGUE_TIERS.find((t) => t.id === tier.id);
                const max = Math.max(...data.stats.byTier.map((t) => t.count), 1);
                return (
                  <li key={tier.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-bold text-[#1C1917]">
                        {meta ? (
                          <Image src={meta.badge} alt="" width={22} height={22} className="h-5 w-5 object-contain" />
                        ) : null}
                        {tier.label}
                      </span>
                      <span className="font-extrabold text-[#64748B]">{tier.count}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#F5F5F4]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: tier.count ? `${Math.max((tier.count / max) * 100, 8)}%` : "0%",
                          background: tier.color,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/dashboard/ligues"
              className="mt-5 inline-flex text-sm font-extrabold text-[#1677FF] hover:text-[#155EEF]"
            >
              Ouvrir les ligues
            </Link>
          </article>
        </section>

        <article className={CARD}>
          <h2 className="mb-4 text-[15px] font-black tracking-tight text-[#1C1917]">Élèves par classe</h2>
          {data.stats.byClass.length === 0 ? (
            <p className="text-sm font-semibold text-[#A8A29E]">Aucune classe renseignée.</p>
          ) : (
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr))]">
              {data.stats.byClass.map((c) => (
                <div key={c.id} className="rounded-2xl bg-[#FAFAF9] px-4 py-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#64748B]">{c.label}</p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-[#1C1917]">{c.count}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E7E5E4]">
                    <div
                      className="h-full rounded-full bg-[#1677FF]"
                      style={{ width: `${Math.max((c.count / classMax) * 100, 12)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </main>
    </>
  );
}

function lomeGreeting() {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Lome",
    hour: "numeric",
    hourCycle: "h23",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = Number(get("hour"));
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const raw = `${get("weekday")} ${get("day")} ${get("month")}`;
  return { greeting, dateLabel: raw.charAt(0).toUpperCase() + raw.slice(1) };
}

function HeroLink({ href, children, emphasis }: { href: string; children: ReactNode; emphasis?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        emphasis
          ? "bg-[#1677FF] text-white hover:bg-[#155EEF]"
          : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20"
      }`}
    >
      {children}
    </Link>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.8 19c.7-3 2.8-4.8 5.2-4.8s4.5 1.8 5.2 4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.2 14.4c1.6.4 2.9 1.6 3.6 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M18 15l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6.6-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 12h4l2.2-5 3.6 10L15 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5zM10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 17.5 4 20V7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v7a2.5 2.5 0 0 1-2.5 2.5H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
