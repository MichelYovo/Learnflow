export default function StatCard({
  label,
  value,
  hint,
  tone = "blue",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "blue" | "green" | "amber" | "violet";
}) {
  const tones = {
    blue: "bg-[#E6F4FF] text-[#1677FF]",
    green: "bg-[#ECFDF5] text-[#10B981]",
    amber: "bg-[#FFFBEB] text-[#F59E0B]",
    violet: "bg-[#F5F3FF] text-[#8B5CF6]",
  };
  return (
    <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
      <p className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide ${tones[tone]}`}>
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight text-[#1C1917]">{value}</p>
      {hint ? <p className="mt-1 text-sm font-medium text-[#64748B]">{hint}</p> : null}
    </article>
  );
}
