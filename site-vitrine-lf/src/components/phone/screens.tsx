import { SUBJECTS } from "../../lib/brand";
import { StatusBar, TabBar } from "./chrome";

const MODES_HOME = [
  { label: "Libre", spira: "calme", bg: "#ECFDF5", color: "#10B981", border: "#A7F3D0" },
  { label: "Guidé", spira: "confiant", bg: "#E6F4FF", color: "#1677FF", border: "#1677FF" },
  { label: "Cramming", spira: "determine", bg: "#FFFBEB", color: "#F59E0B", border: "#FDE68A" },
  { label: "Blitz 60s", spira: "enerve", bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" },
];

export function HomeMock() {
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="bg-white">
        <StatusBar />
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/avatars/avatar-01.png" alt="" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="text-[13px] font-semibold text-[#64748B]">Salut</p>
              <p className="text-[20px] font-extrabold leading-none text-[#1C1917]">Kofi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-[14px] bg-[#FEF3C7] px-2.5 py-2 text-[14px] font-extrabold text-[#D97706]">
              🔥 7
            </span>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC]">
              <span className="text-[16px]">🔔</span>
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-hidden px-5 py-4">
        <div className="flex items-center justify-between rounded-3xl bg-[linear-gradient(135deg,#1677FF_0%,#00B8F4_100%)] px-5 py-5">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-[20px] font-extrabold text-white">Pythagore</p>
            <p className="mt-1 text-[15px] font-semibold text-white/90">Leçon 3/5 · Maths</p>
            <div className="mt-3.5 h-2 rounded-full bg-white/30">
              <div className="h-2 w-[62%] rounded-full bg-white" />
            </div>
          </div>
          <span className="rounded-2xl bg-white px-4 py-3.5 text-[16px] font-extrabold text-[#1677FF]">Continuer</span>
        </div>

        <p className="text-[18px] font-extrabold text-[#1C1917]">Modes</p>
        <div className="grid grid-cols-2 gap-3">
          {MODES_HOME.map((m) => (
            <div
              key={m.label}
              className="min-h-[118px] rounded-3xl p-4"
              style={{ background: m.bg, border: `2px solid ${m.border}` }}
            >
              <div className="mb-3 flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-[18px] bg-white">
                <img src={`/spira/${m.spira}.png`} alt="" className="h-12 w-12 object-contain" />
              </div>
              <p className="text-[16px] font-extrabold" style={{ color: m.color }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[18px] font-extrabold text-[#1C1917]">Mes matières</p>
            <span className="text-[13px] font-bold text-[#1677FF]">Voir tout</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {SUBJECTS.slice(0, 5).map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1.5">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-[18px] text-[11px] font-black"
                  style={{ color: s.color, background: s.bg }}
                >
                  {s.label.slice(0, 2)}
                </span>
                <span className="w-full truncate text-center text-[10px] font-bold text-[#64748B]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#F1F5F9] bg-white p-4">
          <p className="text-[16px] font-extrabold text-[#1C1917]">Ma progression</p>
          <div className="mt-3 flex">
            {[
              ["12", "leçons"],
              ["4h", "d'étude"],
              ["+240", "XP"],
            ].map(([v, l], i) => (
              <div key={l} className={`flex flex-1 flex-col items-center ${i < 2 ? "border-r border-[#E5E7EB]" : ""}`}>
                <p className="text-[18px] font-extrabold text-[#1C1917]">{v}</p>
                <p className="text-[11px] font-semibold text-[#9CA3AF]">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
          <img src="/badges/gold.png" alt="" className="h-12 w-12 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold text-[#1C1917]">Ligue Or</p>
            <p className="text-[13px] font-semibold text-[#D97706]">#4</p>
          </div>
        </div>
      </div>
      <TabBar active="Accueil" />
    </div>
  );
}

export function QuizMock() {
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <StatusBar />
      <div className="flex items-center gap-2 px-4 pb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F0EFEE] bg-white text-[16px] text-[#1C1917]">
          ×
        </span>
        <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#F0EFEE]">
          <div className="h-2.5 w-[70%] rounded-full bg-[#1677FF]" />
        </div>
        <span className="text-[13px] font-extrabold text-[#1677FF]">7/10</span>
        <img src="/spira/confiant.png" alt="" className="h-8 w-8 object-contain" />
      </div>
      <div className="flex-1 space-y-3 px-5 pt-2">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#A8A29E]">Assimilation · SVT</p>
        <p className="text-[18px] font-extrabold leading-snug text-[#1C1917]">
          Le neurone transmet l’influx nerveux grâce à…
        </p>
        {[
          { t: "La synapse chimique", ok: true, letter: "A" },
          { t: "La paroi des alvéoles", ok: false, letter: "B" },
          { t: "Le globule rouge", ok: false, letter: "C" },
          { t: "La bile du foie", ok: false, letter: "D" },
        ].map((o) => (
          <div
            key={o.t}
            className="flex items-center gap-3 rounded-[18px] border-2 px-3 py-3 text-[14px] font-bold"
            style={
              o.ok
                ? { borderColor: "#10B981", background: "#ECFDF5", color: "#065F46" }
                : { borderColor: "#E7E5E4", background: "#fff", color: "#1C1917", opacity: 0.45 }
            }
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-black"
              style={o.ok ? { background: "#10B981", color: "#fff" } : { background: "#F5F5F4", color: "#64748B" }}
            >
              {o.ok ? "✓" : o.letter}
            </span>
            {o.t}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-[#A7F3D0] bg-[#ECFDF5] px-5 py-3">
        <p className="text-[15px] font-extrabold text-[#10B981]">C’est ça !</p>
        <p className="mt-0.5 text-[12px] font-medium leading-4 text-[#64748B]">L’influx passe d’un neurone à l’autre au niveau de la synapse.</p>
        <div className="mt-2 rounded-2xl bg-[#10B981] py-2.5 text-center text-[14px] font-extrabold text-white">Continuer</div>
      </div>
    </div>
  );
}

export function ResultMock() {
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="bg-[linear-gradient(180deg,#10B981_0%,#059669_100%)] px-6 pb-8 pt-2 text-center text-white">
        <StatusBar light />
        <img src="/spira/joyeux.png" alt="" className="mx-auto h-[104px] w-[104px] object-contain" />
        <p className="mt-2 text-[28px] font-extrabold">Parfait !</p>
        <p className="mt-1 text-[13px] text-white/90">Règle du 10/10 validée · +375 XP · Badge CHALLENGER</p>
      </div>
      <div className="flex-1 space-y-3 px-5 pt-5">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-widest text-[#A8A29E]">
          Étape 2 — Instant T
        </p>
        <div className="flex items-center gap-3 rounded-[20px] border-2 border-[#BAE0FF] bg-[#E6F4FF] p-4">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-[15px] font-extrabold text-[#1677FF]">Option Sprint</p>
            <p className="text-[13px] font-semibold text-[#64748B]">Grand Quizz maintenant · XP ×2</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[20px] border-2 border-[#F0EFEE] bg-white p-4">
          <img src="/spira/fatigue.png" alt="" className="h-11 w-11 object-contain" />
          <div>
            <p className="text-[15px] font-extrabold text-[#F59E0B]">Option Repos</p>
            <p className="text-[13px] font-semibold text-[#64748B]">Verrouille 1 h + rappel local</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeagueMock() {
  const podium = [
    { place: 2, name: "Ama", xp: "3 120", avatar: "/avatars/avatar-05.png", h: 96, g: "linear-gradient(#E2E8F0,#94A3B8)" },
    { place: 1, name: "Toi", xp: "3 840", avatar: "/avatars/avatar-01.png", h: 132, g: "linear-gradient(#FDE68A,#F59E0B)" },
    { place: 3, name: "Kodjo", xp: "2 910", avatar: "/avatars/avatar-08.png", h: 80, g: "linear-gradient(#FED7AA,#F97316)" },
  ];
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="border-b border-[#F0EFEE] bg-white">
        <StatusBar />
        <div className="px-5 pb-3">
          <p className="text-[22px] font-extrabold text-[#1C1917]">Ligues</p>
          <div className="mt-3 flex gap-2">
            <span className="flex items-center gap-1 rounded-xl border border-[#1677FF] bg-[#E6F4FF] px-3 py-2 text-[13px] font-extrabold text-[#1677FF]">
              Classement
            </span>
            <span className="rounded-xl bg-[#F5F5F4] px-3 py-2 text-[13px] font-semibold text-[#A8A29E]">Badges</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-4 pt-3">
        <div className="mb-3 flex items-center justify-center gap-2">
          {["bronze", "silver", "gold", "platinum", "diamond"].map((t, i) => (
            <img
              key={t}
              src={`/badges/${t}.png`}
              alt=""
              className={`object-contain ${i === 2 ? "h-12 w-12" : "h-8 w-8 opacity-50"}`}
            />
          ))}
        </div>
        <div className="rounded-[20px] border border-[#F0EFEE] bg-white p-4">
          <p className="mb-3 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#A8A29E]">
            Podium de la semaine
          </p>
          <div className="flex items-end justify-center gap-2">
            {podium.map((p) => (
              <div key={p.place} className="flex flex-1 flex-col items-center gap-1.5">
                {p.place === 1 ? <span className="text-[#F59E0B]">🏅</span> : <span className="h-[22px]" />}
                <img
                  src={p.avatar}
                  alt=""
                  className="rounded-full object-cover"
                  style={{
                    width: p.place === 1 ? 64 : 52,
                    height: p.place === 1 ? 64 : 52,
                    border: p.place === 1 ? "3px solid #FBBF24" : "2px solid #fff",
                  }}
                />
                <p className="text-[13px] font-extrabold text-[#1C1917]">{p.name}</p>
                <p className="text-[12px] font-extrabold text-[#1677FF]">{p.xp}</p>
                <div className="w-full rounded-t-lg" style={{ height: p.h / 2.2, background: p.g }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="Ligue" />
    </div>
  );
}

export function BlitzMock() {
  return (
    <div className="flex h-full flex-col bg-[#090001] text-white">
      <div className="flex h-3 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={`flex-1 ${i % 2 === 0 ? "bg-[#F59E0B]" : "bg-[#111]"}`} />
        ))}
      </div>
      <StatusBar light />
      <div className="flex items-center justify-between px-5">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-extrabold text-[#FBBF24]">Moyen</span>
        <span className="font-mono text-[13px] font-bold text-white/70">LF-M7K2</span>
        <img src="/spira/enerve.png" alt="" className="h-9 w-9 object-contain" />
      </div>
      <div className="flex flex-1 flex-col items-center px-5 pt-4">
        <div className="relative mb-4 flex h-[120px] w-[120px] items-center justify-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#3B070C" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="10"
              strokeDasharray="327"
              strokeDashoffset="90"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[32px] font-black tabular-nums">42</span>
        </div>
        <p className="mb-4 text-center text-[17px] font-extrabold leading-snug">
          Factorise : x² − 9 =
        </p>
        <div className="grid w-full grid-cols-1 gap-2.5">
          {["(x−3)(x+3)", "(x−9)(x+1)", "x(x−9)", "(x−3)²"].map((o, i) => (
            <div
              key={o}
              className="rounded-2xl border-2 px-4 py-3.5 text-[15px] font-bold"
              style={
                i === 0
                  ? { borderColor: "#34D399", background: "rgba(16,185,129,.15)" }
                  : { borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)" }
              }
            >
              {o}
            </div>
          ))}
        </div>
        <p className="mt-auto pb-6 text-[12px] font-bold text-white/50">Score · 180 XP</p>
      </div>
    </div>
  );
}

export function CourseMock() {
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="bg-white">
        <StatusBar />
        <div className="flex items-center gap-3 px-4 pb-3">
          <span className="text-[20px] text-[#1C1917]">←</span>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#10B981]">SVT · 3ème</p>
            <p className="text-[16px] font-extrabold text-[#1C1917]">Le neurone</p>
          </div>
        </div>
        <div className="mx-4 mb-3 flex rounded-2xl bg-[#F5F5F4] p-1">
          <span className="flex-1 rounded-xl bg-white py-2 text-center text-[13px] font-extrabold text-[#1677FF] shadow-sm">
            L’Essentiel
          </span>
          <span className="flex-1 py-2 text-center text-[13px] font-semibold text-[#A8A29E]">En Détails</span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-5 py-3">
        <img src="/schemas/neurone.jpg" alt="" className="h-28 w-full rounded-2xl object-cover" />
        <ul className="space-y-3.5">
          {[
            <>Le <span className="font-bold text-[#1677FF]">neurone</span> conduit le message nerveux dans un seul sens.</>,
            <><span className="font-bold text-[#1677FF]">Dendrites</span> reçoivent → <span className="font-bold text-[#1677FF]">corps cellulaire</span> → <span className="font-bold text-[#1677FF]">axone</span> envoie.</>,
            <>La <span className="font-bold text-[#1677FF]">myéline</span> accélère : l’influx saute aux nœuds de Ranvier.</>,
            <>À la <span className="font-bold text-[#1677FF]">synapse</span>, l’électrique devient chimique.</>,
          ].map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1677FF]" />
              <p className="text-[16px] font-medium leading-6 text-[#1C1917]">{line}</p>
            </li>
          ))}
        </ul>
        <div className="flex items-start gap-3 rounded-2xl border-2 border-[#BAE0FF] bg-[#E6F4FF] p-3">
          <img src="/spira/confiant.png" alt="" className="h-12 w-12 shrink-0 object-contain" />
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#1677FF]">Analogie de Spira</p>
            <p className="mt-0.5 text-[13px] font-medium leading-[19px] text-[#44403C]">
              Le neurone, c’est un fil. La myéline, c’est la gaine : le courant va plus vite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
