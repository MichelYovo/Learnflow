"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { SUBJECTS } from "../../lib/brand";
import { StatusBar, TabBar } from "./chrome";

function usePlayPhase(playKey: number, delays: number[]) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setPhase(0);
    const timers = delays.map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
    // delays are fixed per screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);
  return phase;
}

export function ProfilePlay({ playKey }: { playKey: number }) {
  const phase = usePlayPhase(playKey, [220, 700]);
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="bg-white">
        <StatusBar />
        <p className="px-5 pb-3 text-[22px] font-extrabold text-[#1C1917]">C’est toi ?</p>
      </div>
      <div className="flex flex-1 flex-col items-center px-6 pt-8">
        <img
          src="/avatars/avatar-01.png"
          alt=""
          className={`h-24 w-24 rounded-full object-cover ring-4 ring-[#BAE0FF] ${phase >= 1 ? "lf-play-pop" : "opacity-40"}`}
        />
        <p className={`mt-4 text-[24px] font-extrabold text-[#1C1917] ${phase >= 1 ? "lf-play-up" : "opacity-0"}`}>Kofi</p>
        <p className={`mt-1 text-[15px] font-semibold text-[#64748B] ${phase >= 1 ? "lf-play-up" : "opacity-0"}`}>3ème · Lomé</p>
        <div className={`mt-6 flex flex-wrap justify-center gap-2 ${phase >= 2 ? "lf-play-up" : "opacity-0"}`}>
          {SUBJECTS.slice(0, 4).map((s) => (
            <span key={s.id} className="rounded-full px-3 py-1.5 text-[12px] font-extrabold" style={{ color: s.color, background: s.bg }}>
              {s.label}
            </span>
          ))}
        </div>
        <span
          className={`mt-auto mb-10 rounded-2xl bg-[#1677FF] px-8 py-3.5 text-[16px] font-extrabold text-white ${phase >= 2 ? "lf-play-pulse" : "opacity-40"}`}
        >
          C’est parti
        </span>
      </div>
    </div>
  );
}

export function CoursePlay({ playKey }: { playKey: number }) {
  const phase = usePlayPhase(playKey, [280, 700, 1100]);
  const lines = [
    <>Le <span className={phase >= 1 ? "lf-play-mark" : ""}>neurone</span> conduit le message nerveux dans un seul sens.</>,
    <><span className={phase >= 2 ? "lf-play-mark" : ""}>Dendrites</span> reçoivent → corps cellulaire → axone envoie.</>,
    <>À la <span className={phase >= 3 ? "lf-play-mark" : ""}>synapse</span>, l’électrique devient chimique.</>,
  ];
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pb-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#10B981]">SVT · 3ème</p>
          <p className="text-[18px] font-extrabold text-[#1C1917]">Le neurone</p>
        </div>
        <div className="mx-4 mb-3 flex rounded-2xl bg-[#F5F5F4] p-1">
          <span className="flex-1 rounded-xl bg-white py-2 text-center text-[13px] font-extrabold text-[#1677FF] shadow-sm">
            L’Essentiel
          </span>
          <span className="flex-1 py-2 text-center text-[13px] font-semibold text-[#A8A29E]">En Détails</span>
        </div>
      </div>
      <div className="flex-1 space-y-4 px-5 pt-4">
        {lines.map((line, i) => (
          <p key={i} className={`text-[16px] font-medium leading-6 text-[#1C1917] ${phase >= i ? "lf-play-up" : "opacity-30"}`}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export function QuizPlay({ playKey, outcome = "ok" }: { playKey: number; outcome?: "ok" | "ko" }) {
  const phase = usePlayPhase(playKey, [280, 850]);
  const options = [
    { t: "La synapse chimique", id: "ok", letter: "A" },
    { t: "La paroi des alvéoles", id: "a", letter: "B" },
    { t: "Le globule rouge", id: "b", letter: "C" },
    { t: "La bile du foie", id: "c", letter: "D" },
  ];
  const picked = outcome === "ok" ? "ok" : "a";
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <StatusBar />
      <div className="flex items-center gap-2 px-4 pb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F0EFEE] bg-white text-[16px] text-[#1C1917]">
          ×
        </span>
        <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#F0EFEE]">
          <div className={`h-2.5 rounded-full bg-[#1677FF] transition-all duration-500 ${phase >= 2 && outcome === "ok" ? "w-full" : "w-[70%]"}`} />
        </div>
        <span className="text-[13px] font-extrabold text-[#1677FF]">{phase >= 2 ? (outcome === "ok" ? "10/10" : "7/10") : "9/10"}</span>
      </div>
      <div className="flex-1 space-y-2.5 px-5 pt-2">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#A8A29E]">Assimilation · SVT</p>
        <p className="text-[17px] font-extrabold leading-snug text-[#1C1917]">Le neurone transmet l’influx grâce à…</p>
        {options.map((o) => {
          const selected = phase >= 1 && o.id === picked;
          const revealed = phase >= 2;
          const isOk = o.id === "ok";
          const dim = revealed && !isOk && !selected;
          let style: CSSProperties = { borderColor: "#E7E5E4", background: "#fff", color: "#1C1917" };
          let cls = "";
          let badge: CSSProperties = { background: "#F5F5F4", color: "#64748B" };
          let mark = o.letter;
          if (selected && !revealed) {
            style = { borderColor: "#1677FF", background: "#E6F4FF", color: "#1677FF" };
            badge = { background: "#1677FF", color: "#fff" };
          }
          if (revealed && isOk) {
            style = { borderColor: "#10B981", background: "#ECFDF5", color: "#065F46" };
            badge = { background: "#10B981", color: "#fff" };
            mark = "✓";
            cls = "lf-play-ok";
          }
          if (revealed && selected && !isOk) {
            style = { borderColor: "#EF4444", background: "#FEF2F2", color: "#991B1B" };
            badge = { background: "#EF4444", color: "#fff" };
            mark = "×";
            cls = "lf-play-ko";
          }
          return (
            <div
              key={o.t}
              className={`flex items-center gap-3 rounded-[18px] border-2 px-3 py-3 text-[14px] font-bold ${cls}`}
              style={{ ...style, opacity: dim ? 0.42 : 1 }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-black" style={badge}>
                {mark}
              </span>
              {o.t}
            </div>
          );
        })}
      </div>
      {phase >= 2 ? (
        <div
          className="lf-play-up border-t-2 px-5 py-3"
          style={
            outcome === "ok"
              ? { background: "#ECFDF5", borderColor: "#A7F3D0" }
              : { background: "#FEF2F2", borderColor: "#FECACA" }
          }
        >
          <p className="text-[15px] font-extrabold" style={{ color: outcome === "ok" ? "#10B981" : "#EF4444" }}>
            {outcome === "ok" ? "C’est ça !" : "Pas tout à fait"}
          </p>
          <p className="mt-0.5 text-[12px] font-medium leading-4 text-[#64748B]">
            {outcome === "ok" ? "L’influx passe d’un neurone à l’autre au niveau de la synapse." : "On revoit seulement cette question."}
          </p>
          <div
            className="mt-2 rounded-2xl py-2.5 text-center text-[14px] font-extrabold text-white"
            style={{ background: outcome === "ok" ? "#10B981" : "#EF4444" }}
          >
            Continuer
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ResultPlay({ playKey }: { playKey: number }) {
  const phase = usePlayPhase(playKey, [200, 650]);
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#10B981_0%,#059669_100%)] px-6 pb-8 pt-2 text-center text-white">
        <StatusBar light />
        {phase >= 1 ? <span className="lf-play-burst" aria-hidden /> : null}
        <p className={`mt-8 text-[52px] font-black ${phase >= 1 ? "lf-play-pop" : "opacity-0"}`}>10/10</p>
        <p className={`mt-2 text-[26px] font-extrabold ${phase >= 1 ? "lf-play-up" : "opacity-0"}`}>Parfait !</p>
        <p className={`mt-2 text-[13px] text-white/90 ${phase >= 2 ? "lf-play-up" : "opacity-0"}`}>Chapitre validé · Badge Challenger</p>
      </div>
      <div className="flex-1 space-y-3 px-5 pt-5">
        <div className={`flex items-center gap-3 rounded-[20px] border-2 border-[#BAE0FF] bg-[#E6F4FF] p-4 ${phase >= 2 ? "lf-play-up" : "opacity-30"}`}>
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-[15px] font-extrabold text-[#1677FF]">+375 points</p>
            <p className="text-[13px] font-semibold text-[#64748B]">Uniquement parce que c’est parfait</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaguePlay({ playKey }: { playKey: number }) {
  const phase = usePlayPhase(playKey, [250, 700]);
  const podium = [
    { place: 2, name: "Ama", xp: "3 120", avatar: "/avatars/avatar-05.png", h: 44, g: "linear-gradient(#E2E8F0,#94A3B8)" },
    { place: 1, name: "Toi", xp: "3 840", avatar: "/avatars/avatar-01.png", h: 64, g: "linear-gradient(#FDE68A,#F59E0B)" },
    { place: 3, name: "Kodjo", xp: "2 910", avatar: "/avatars/avatar-08.png", h: 36, g: "linear-gradient(#FED7AA,#F97316)" },
  ];
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <div className="border-b border-[#F0EFEE] bg-white">
        <StatusBar />
        <p className="px-5 pb-3 text-[22px] font-extrabold text-[#1C1917]">Ligues</p>
      </div>
      <div className="flex-1 px-4 pt-4">
        <p className="mb-4 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#A8A29E]">Podium de la semaine</p>
        <div className="flex items-end justify-center gap-2">
          {podium.map((p, i) => (
            <div key={p.place} className={`flex flex-1 flex-col items-center gap-1.5 ${phase >= 1 ? "lf-play-up" : "opacity-0"}`} style={{ animationDelay: `${i * 80}ms` }}>
              {p.place === 1 ? <span className="text-[#F59E0B]">🏅</span> : <span className="h-[22px]" />}
              <img src={p.avatar} alt="" className="rounded-full object-cover" style={{ width: p.place === 1 ? 64 : 52, height: p.place === 1 ? 64 : 52 }} />
              <p className="text-[13px] font-extrabold text-[#1C1917]">{p.name}</p>
              <p className="text-[12px] font-extrabold text-[#1677FF]">{p.xp}</p>
              <div
                className={`w-full rounded-t-lg ${phase >= 2 ? "lf-play-bar" : "h-2"}`}
                style={{ height: phase >= 2 ? p.h : 8, background: p.g }}
              />
            </div>
          ))}
        </div>
      </div>
      <TabBar active="Ligue" />
    </div>
  );
}

export function BlitzPlay({ playKey }: { playKey: number }) {
  const phase = usePlayPhase(playKey, [200, 900]);
  const [n, setN] = useState(60);
  useEffect(() => {
    setN(60);
    const t = window.setInterval(() => {
      setN((v) => {
        if (v <= 43) {
          window.clearInterval(t);
          return 42;
        }
        return v - 1;
      });
    }, 40);
    return () => window.clearInterval(t);
  }, [playKey]);
  return (
    <div className="flex h-full flex-col bg-[#090001] text-white">
      <StatusBar light />
      <div className="flex flex-1 flex-col items-center px-5 pt-6">
        <div className={`mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-full border-8 border-[#F59E0B] ${phase >= 1 ? "lf-play-pulse" : ""}`}>
          <span className="text-[32px] font-black tabular-nums">{n}</span>
        </div>
        <p className="mb-4 text-center text-[17px] font-extrabold">Factorise : x² − 9 =</p>
        {["(x−3)(x+3)", "(x−9)(x+1)", "x(x−9)"].map((o, i) => (
          <div
            key={o}
            className="mb-2.5 w-full rounded-2xl border-2 px-4 py-3.5 text-[15px] font-bold"
            style={
              phase >= 2 && i === 0
                ? { borderColor: "#34D399", background: "rgba(16,185,129,.15)" }
                : { borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)" }
            }
          >
            {o}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SmsPlay({ playKey }: { playKey: number }) {
  const phase = usePlayPhase(playKey, [280, 800]);
  return (
    <div className="flex h-full flex-col bg-[#F2F2F7]">
      <StatusBar />
      <p className="px-5 pb-2 text-[22px] font-extrabold text-[#1C1917]">Messages</p>
      <div className="flex-1 px-4 pt-6">
        <div className={`mx-auto max-w-[280px] rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,.12)] ${phase >= 1 ? "lf-play-up" : "translate-y-8 opacity-0"}`}>
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-[#1677FF]">LearnFlow</p>
          <p className="mt-2 text-[16px] font-bold leading-snug text-[#1C1917]">
            Bravo Kofi ! Chapitre « Le neurone » validé 10/10.
          </p>
          <p className={`mt-3 text-[13px] font-semibold text-[#64748B] ${phase >= 2 ? "lf-play-up" : "opacity-0"}`}>
            C’est tout. Pas de notes en direct.
          </p>
        </div>
      </div>
    </div>
  );
}

export function OfflinePlay({ playKey }: { playKey: number }) {
  const phase = usePlayPhase(playKey, [250]);
  return (
    <div className="flex h-full flex-col bg-[#FAFAF9]">
      <StatusBar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className={`mb-4 rounded-full bg-[#E6F4FF] px-3 py-1 text-[12px] font-extrabold text-[#1677FF] ${phase >= 1 ? "lf-play-pop" : "opacity-0"}`}>
          Sans réseau
        </span>
        <p className={`text-[22px] font-extrabold text-[#1C1917] ${phase >= 1 ? "lf-play-up" : "opacity-0"}`}>Tes cours sont là.</p>
        <p className="mt-2 text-[15px] font-medium text-[#64748B]">Bus, maison, école — même sans internet.</p>
        <div className="mt-8 w-full space-y-2">
          {["Fiche · Le neurone", "Quiz · 7/10", "Blitz prêt"].map((t, i) => (
            <div key={t} className={`rounded-2xl border-2 border-[#F0EFEE] bg-white px-4 py-3 text-left text-[15px] font-bold text-[#1C1917] ${phase >= 1 ? "lf-play-up" : "opacity-0"}`} style={{ animationDelay: `${i * 90}ms` }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
