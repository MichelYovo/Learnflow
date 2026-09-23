import type { ReactNode } from "react";

const TONES = {
  blue: { chip: "bg-[#E6F4FF] text-[#1677FF]", bar: "bg-[#1677FF]" },
  green: { chip: "bg-[#ECFDF5] text-[#059669]", bar: "bg-[#10B981]" },
  amber: { chip: "bg-[#FFFBEB] text-[#D97706]", bar: "bg-[#F59E0B]" },
  violet: { chip: "bg-[#F5F3FF] text-[#7C3AED]", bar: "bg-[#8B5CF6]" },
  red: { chip: "bg-[#FEF2F2] text-[#DC2626]", bar: "bg-[#EF4444]" },
} as const;

export default function StatCard({
  label,
  value,
  hint,
  tone = "blue",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof TONES;
  icon?: ReactNode;
}) {
  const palette = TONES[tone];
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E7E5E4] bg-white p-5 shadow-[0_12px_32px_rgba(28,25,23,.045)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(28,25,23,.08)]">
      <span className={`absolute inset-x-0 top-0 h-1 ${palette.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <p className="pt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#A8A29E]">{label}</p>
        {icon ? (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${palette.chip}`}>{icon}</span>
        ) : null}
      </div>
      <p className="mt-4 text-[2rem] font-black leading-none tracking-tight text-[#1C1917]">{value}</p>
      {hint ? <p className="mt-2 text-sm font-medium text-[#64748B]">{hint}</p> : null}
    </article>
  );
}
