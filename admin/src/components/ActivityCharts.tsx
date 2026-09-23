"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardData } from "@/lib/catalog";

function shortDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
}

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid #E7E5E4",
  boxShadow: "0 12px 30px rgba(28,25,23,.08)",
  fontSize: 12,
  fontWeight: 700,
};

export default function ActivityCharts({ stats }: { stats: DashboardData["stats"] }) {
  const series = stats.last7Days.map((row) => ({
    ...row,
    label: shortDay(row.day),
  }));
  const total = stats.webEvents + stats.mobileEvents;
  const webShare = total ? Math.round((stats.webEvents / total) * 100) : 0;
  const mobileShare = total ? 100 - webShare : 0;

  return (
    <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
      <article className="flex h-full min-w-0 flex-col rounded-[24px] border border-[#E7E5E4] bg-white p-5 shadow-[0_12px_32px_rgba(28,25,23,.045)]">
        <h2 className="text-[15px] font-black tracking-tight text-[#1C1917]">Activité sur 7 jours</h2>
        <p className="mb-4 mt-1 text-xs font-semibold text-[#64748B]">Mouvements web et mobile</p>
        <div className="min-h-64 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={280} initialDimension={{ width: 720, height: 256 }}>
            <BarChart data={series} barGap={6} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F4" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700, fill: "#78716C" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(22,119,255,0.06)" }} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 8 }} />
              <Bar dataKey="web" name="Web" fill="#1677FF" radius={[8, 8, 0, 0]} maxBarSize={28} />
              <Bar dataKey="mobile" name="Mobile" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="flex flex-col rounded-[24px] border border-[#E7E5E4] bg-white p-5 shadow-[0_12px_32px_rgba(28,25,23,.045)]">
        <h2 className="text-[15px] font-black tracking-tight text-[#1C1917]">Web et mobile</h2>
        <p className="mt-1 text-xs font-semibold text-[#64748B]">Part des événements</p>
        <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-[#F5F5F4]">
          <div className="h-full bg-[#1677FF]" style={{ width: `${total ? webShare : 0}%` }} />
          <div className="h-full bg-[#10B981]" style={{ width: `${total ? mobileShare : 0}%` }} />
        </div>
        <div className="mt-5 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <PlatformTile label="Web" value={stats.webEvents} share={webShare} tone="blue" />
          <PlatformTile label="Mobile" value={stats.mobileEvents} share={mobileShare} tone="green" />
        </div>
      </article>
    </section>
  );
}

function PlatformTile({
  label,
  value,
  share,
  tone,
}: {
  label: string;
  value: number;
  share: number;
  tone: "blue" | "green";
}) {
  const styles =
    tone === "blue" ? "bg-[#F3F8FF] text-[#1677FF]" : "bg-[#F0FDF8] text-[#059669]";
  return (
    <div className={`rounded-2xl px-4 py-4 ${styles}`}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-[#1C1917]">{value.toLocaleString("fr-FR")}</p>
      <p className="mt-1 text-xs font-bold opacity-80">{share}% du volume</p>
    </div>
  );
}
