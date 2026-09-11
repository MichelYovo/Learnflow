import { MODES } from "../../lib/brand";

export default function ModeShowcase() {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      {MODES.map((m) => (
        <article
          key={m.id}
          className="rounded-[24px] border-2 p-5 sm:p-6"
          style={{ background: m.bg, borderColor: m.border }}
        >
          <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: m.color }}>
            {m.hint}
          </p>
          <h3 className="mt-3 text-xl font-black tracking-tight" style={{ color: m.color }}>
            {m.label}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#1C1917]">{m.sub}</p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[#64748B]">{m.purpose}</p>
        </article>
      ))}
    </div>
  );
}
