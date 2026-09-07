"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardData } from "@/lib/catalog";

function shortDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
}

export default function ActivityCharts({ stats }: { stats: DashboardData["stats"] }) {
  const series = stats.last7Days.map((row) => ({
    ...row,
    label: shortDay(row.day),
  }));
  const platforms = [
    { name: "Web", value: stats.webEvents, fill: "#1677FF" },
    { name: "Mobile", value: stats.mobileEvents, fill: "#10B981" },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="mb-1 text-base font-black text-[#1C1917]">Activité 7 jours</h2>
        <p className="mb-4 text-xs font-semibold text-[#64748B]">Mouvements web et mobile</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EFEE" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="web" name="Web" fill="#1677FF" radius={[6, 6, 0, 0]} />
              <Bar dataKey="mobile" name="Mobile" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="mb-1 text-base font-black text-[#1C1917]">Web vs mobile</h2>
        <p className="mb-4 text-xs font-semibold text-[#64748B]">Volume d’événements</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platforms} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0EFEE" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fontWeight: 800, fill: "#1C1917" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip />
              <Bar dataKey="value" name="Événements" radius={[0, 8, 8, 0]}>
                {platforms.map((p) => (
                  <Cell key={p.name} fill={p.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-4 text-sm font-extrabold">
          <span className="text-[#1677FF]">Web {stats.webEvents}</span>
          <span className="text-[#10B981]">Mobile {stats.mobileEvents}</span>
        </div>
      </article>
    </section>
  );
}
