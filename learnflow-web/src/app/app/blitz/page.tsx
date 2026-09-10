"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import BlitzInviteCard from "@/components/BlitzInviteCard";
import { BLITZ_DIFFICULTES, blitzDeck, blitzShareText, blitzWhatsAppUrl, parseChallengeInput } from "@/engine/blitzChallenge";
import { playSfx, preloadSfx } from "@/lib/sfx";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import type { DifficulteFlash } from "@/types/learnflow";

const DURATION = 60;
const DIFF_META: Record<DifficulteFlash, { color: string; hint: string }> = {
  Facile: { color: "#34D399", hint: "Échauffement — tu chauffes le chrono" },
  Moyen: { color: "#FBBF24", hint: "Le vrai duel — mix standard" },
  Difficile: { color: "#F87171", hint: "Seulement si t'as le cran" },
};

function HazardTape() {
  return (
    <div
      className="pointer-events-none h-3 w-full shrink-0 overflow-hidden md:h-4"
      style={{
        background: "repeating-linear-gradient(-45deg, #F59E0B 0 14px, #111 14px 28px)",
      }}
    />
  );
}

function BlitzRing({
  progress,
  critical,
  warning,
  label,
}: {
  progress: number;
  critical: boolean;
  warning: boolean;
  label: string;
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, progress)));
  const stroke = critical ? "#F87171" : warning ? "#FBBF24" : "#F59E0B";
  return (
    <div className="relative h-[148px] w-[148px] md:h-[200px] md:w-[200px]">
      <svg viewBox="0 0 140 140" className={`h-full w-full ${critical ? "animate-pulse" : ""}`}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="9"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </svg>
      <span
        className="absolute inset-0 flex flex-col items-center justify-center tabular-nums"
        style={{ color: critical ? "#F87171" : "#FBBF24" }}
      >
        <span className="text-3xl font-black leading-none md:text-5xl">{label}</span>
        <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/50 md:text-xs">sec</span>
      </span>
    </div>
  );
}

function Arena({
  critical,
  children,
}: {
  critical?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex h-dvh min-h-dvh flex-col overflow-hidden text-white"
      style={{
        background: critical
          ? "linear-gradient(135deg, #6B0A12 0%, #1A0004 48%, #4A0810 100%)"
          : "linear-gradient(135deg, #3B070C 0%, #090001 48%, #1A0206 100%)",
      }}
    >
      <HazardTape />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <HazardTape />
    </div>
  );
}

function BlitzInner() {
  const router = useRouter();
  const search = useSearchParams();
  const recordBlitz = useLearnFlowStore((s) => s.recordBlitz);
  const setBlitzDifficulte = useLearnFlowStore((s) => s.setBlitzDifficulte);
  const shareOk = useLearnFlowStore((s) => s.settings.privacy.shareBlitzScores);
  const incoming = search.get("code") ?? undefined;
  const startDeck = useMemo(() => {
    const parsed = incoming ? parseChallengeInput(incoming) : null;
    if (parsed) return parsed;
    const d = (search.get("difficulte") as DifficulteFlash | null) ?? useLearnFlowStore.getState().settings.blitzDifficulte ?? "Moyen";
    return blitzDeck(undefined, d);
  }, [incoming, search]);
  const [deck, setDeck] = useState(startDeck);
  const [difficulte, setDifficulte] = useState<DifficulteFlash>(startDeck.difficulte);
  const [codeInput, setCodeInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [xp, setXp] = useState(0);
  const [ringing, setRinging] = useState(false);
  const q = deck.questions[qIdx % deck.questions.length];
  const critical = phase === "playing" && timeLeft <= 10;
  const warning = phase === "playing" && timeLeft <= 20;
  const warnedRef = useRef(false);
  const endedRef = useRef(false);
  const scoreRef = useRef(score);
  const answeredRef = useRef(answered);
  scoreRef.current = score;
  answeredRef.current = answered;

  useEffect(() => {
    preloadSfx();
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    endedRef.current = false;
    warnedRef.current = false;
    const started = Date.now();
    const t = setInterval(() => {
      const elapsed = (Date.now() - started) / 1000;
      const left = Math.max(0, DURATION - elapsed);
      setTimeLeft(left);
      if (left <= 10 && left > 0 && !warnedRef.current) {
        warnedRef.current = true;
        playSfx("warn");
      }
      if (left <= 0 && !endedRef.current) {
        endedRef.current = true;
        clearInterval(t);
        setTimeLeft(0);
        playSfx("timesUp");
        setRinging(true);
      }
    }, 50);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (!ringing) return;
    const t = setTimeout(() => {
      const gained = recordBlitz(scoreRef.current, answeredRef.current, difficulte);
      setXp(gained);
      setPhase("done");
      setRinging(false);
    }, 1150);
    return () => clearTimeout(t);
  }, [ringing, difficulte, recordBlitz]);

  const pick = (i: number) => {
    if (selected !== null || phase !== "playing" || ringing) return;
    setSelected(i);
    const ok = i === q.indexReponseCorrecte;
    playSfx(ok ? "correct" : "wrong");
    setAnswered((n) => n + 1);
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setQIdx((n) => n + 1);
      setSelected(null);
    }, 280);
  };

  const share = (withScore = false) => {
    const text = blitzShareText({
      code: deck.code,
      difficulte: deck.difficulte,
      score: withScore && shareOk ? score : undefined,
      answered: withScore && shareOk ? answered : undefined,
    });
    const wa = blitzWhatsAppUrl(text);
    if (navigator.share) void navigator.share({ text, title: "Duel Blitz LearnFlow" }).catch(() => window.open(wa, "_blank"));
    else window.open(wa, "_blank");
  };

  const joinCode = () => {
    const parsed = parseChallengeInput(codeInput);
    if (!parsed) {
      setJoinError("Code invalide. Exemple : LF-M7K2");
      return false;
    }
    setDeck(parsed);
    setDifficulte(parsed.difficulte);
    setBlitzDifficulte(parsed.difficulte);
    setJoined(true);
    setJoinError("");
    setCodeInput("");
    return true;
  };

  const start = () => {
    endedRef.current = false;
    warnedRef.current = false;
    setRinging(false);
    setTimeLeft(DURATION);
    setScore(0);
    setAnswered(0);
    setQIdx(0);
    setSelected(null);
    setPhase("playing");
  };

  if (phase === "ready") {
    return (
      <Arena>
        <div className="flex min-h-0 flex-1 flex-col px-5 py-4 md:px-10 md:py-6">
          <button
            type="button"
            onClick={() => router.push("/app")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/35 bg-white/10"
            aria-label="Fermer"
          >
            <Icon name="arrow-left" size={18} color="#fff" />
          </button>

          <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto text-center">
            <Spira scene="mode.blitz.ready" size={96} message="" />
            <div className="mt-2 md:mt-4">
              <BlitzRing progress={1} critical warning={false} label="60" />
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:mt-4 md:text-5xl">Duel Blitz</h1>
            <p className="mt-2 max-w-md text-sm font-semibold text-red-200/70 md:text-base">
              60 secondes. Mix de chapitres. Envoie le code, ton ami joue la même série.
            </p>
            <div className="mt-5 grid w-full grid-cols-3 gap-2 md:gap-3">
              {BLITZ_DIFFICULTES.map((d) => {
                const on = d === difficulte;
                const meta = DIFF_META[d];
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDifficulte(d);
                      setBlitzDifficulte(d);
                      setDeck(blitzDeck(undefined, d));
                      setJoined(false);
                    }}
                    className="rounded-2xl border-2 py-3 text-sm font-black md:py-4 md:text-base"
                    style={{
                      background: on ? `${meta.color}22` : "rgba(0,0,0,0.35)",
                      borderColor: on ? meta.color : "rgba(239,68,68,0.35)",
                      color: on ? meta.color : "rgba(254,202,202,0.7)",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs font-semibold text-red-200/55 md:text-sm">{DIFF_META[difficulte].hint}</p>
            <div className="mt-5 w-full max-w-md">
              <BlitzInviteCard
                code={deck.code}
                difficulte={deck.difficulte}
                codeInput={codeInput}
                onCodeInput={(value) => {
                  setJoinError("");
                  setCodeInput(value);
                }}
                onJoin={joinCode}
                onCreate={() => {
                  setDeck(blitzDeck(undefined, difficulte));
                  setJoined(false);
                }}
                onShare={() => share(false)}
                incoming={Boolean(incoming) && !joined}
                joined={joined}
                joinError={joinError}
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl pb-2 pt-4">
            <button
              type="button"
              onClick={start}
              className="flex w-full items-center justify-center gap-2 rounded-[18px] py-4 text-lg font-black md:py-5 md:text-xl"
              style={{ background: "linear-gradient(90deg,#EF4444,#7F1D1D)" }}
            >
              <Icon name="flame" size={18} color="#fff" />
              Entrer dans l&apos;arène
            </button>
          </div>
        </div>
      </Arena>
    );
  }

  if (phase === "done") {
    const survived = score >= Math.max(1, Math.floor(answered * 0.6));
    return (
      <Arena>
        <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col items-center justify-center px-6 text-center">
          <span
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold tracking-[0.16em]"
            style={{
              color: "#FBBF24",
              borderColor: survived ? "rgba(249,115,22,0.55)" : "rgba(245,158,11,0.55)",
              background: survived ? "rgba(249,115,22,0.14)" : "rgba(245,158,11,0.12)",
            }}
          >
            {survived ? "CHRONO TENU" : "CHRONO GAGNANT"}
          </span>
          <Spira
            scene={survived ? "mode.blitz.win" : "mode.blitz.lose"}
            size={140}
            message={survived ? "60 secondes. Tu as tenu." : "Le chrono t'a eu. Reviens plus affûté."}
          />
          <p className="mt-4 text-6xl font-black md:text-7xl">
            {score}/{answered}
          </p>
          <p className="mt-2 font-semibold text-red-200/70 md:text-lg">
            {survived ? "Le mix n'a pas eu ta peau." : "Trop lent sur cette série."} · {deck.difficulte} · +{xp} XP
          </p>
          <p className="mt-3 font-black tracking-[0.18em] text-amber-300">{deck.code}</p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button type="button" onClick={() => share(true)} className="rounded-2xl bg-[#25D366] py-4 text-base font-extrabold md:py-5">
              Envoie le duel sur WhatsApp
            </button>
            <button
              type="button"
              onClick={() => {
                setDeck(blitzDeck(undefined, difficulte));
                setTimeLeft(DURATION);
                setPhase("ready");
              }}
              className="rounded-2xl py-3 font-extrabold text-red-300"
            >
              Nouvelle série
            </button>
            <button type="button" onClick={() => router.push("/app")} className="rounded-2xl py-3 font-extrabold text-white/70">
              Quitter le défi
            </button>
          </div>
        </div>
      </Arena>
    );
  }

  return (
    <Arena critical={critical}>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-3 md:px-10 md:py-5">
        <div className="flex items-center justify-between gap-4">
          <Spira scene={critical ? "mode.blitz.panic" : "mode.blitz.play"} size={56} message="" />
          <BlitzRing
            progress={timeLeft / DURATION}
            critical={critical}
            warning={warning}
            label={String(Math.ceil(timeLeft))}
          />
          <p className="min-w-[72px] text-right text-sm font-extrabold text-red-200/80 md:text-base">
            {score} pts
            <span className="mt-0.5 block text-xs font-bold text-white/40">Q{answered + 1}</span>
          </p>
        </div>

        <p
          className={`mt-2 text-center text-[11px] font-black tracking-[0.12em] md:mt-3 md:text-xs ${
            critical ? "text-red-200" : warning ? "text-amber-400" : "text-white/40"
          }`}
        >
          {critical ? "DERNIÈRES SECONDES — NE LÂCHE RIEN" : warning ? "Le chrono se resserre" : "Pas de retour en arrière"}
        </p>

        <div className="mx-auto mt-3 flex min-h-0 w-full max-w-3xl flex-1 flex-col md:mt-5">
          <p className="text-[11px] font-black tracking-[0.16em] text-orange-500 md:text-xs">
            {(q.matiere ?? "MIX").toUpperCase()} · {deck.difficulte.toUpperCase()}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-snug md:text-4xl md:leading-tight">{q.enonceQuestion}</h1>
          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2.5 md:mt-6 md:gap-3">
            {q.optionsProposees.map((opt, i) => {
              const on = selected === i;
              const ok = on && i === q.indexReponseCorrecte;
              const ko = on && i !== q.indexReponseCorrecte;
              return (
                <button
                  key={opt}
                  type="button"
                  onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    pick(i);
                  }}
                  onClick={() => pick(i)}
                  className="flex min-h-[56px] flex-1 items-center rounded-2xl border-2 px-5 text-left text-base font-bold md:min-h-[72px] md:rounded-3xl md:px-6 md:text-xl"
                  style={{
                    borderColor: ok ? "#34D399" : ko ? "#F87171" : "rgba(239,68,68,0.28)",
                    background: ok ? "rgba(16,185,129,0.16)" : ko ? "rgba(239,68,68,0.22)" : "rgba(0,0,0,0.35)",
                    transform: ok ? "scale(1.01)" : undefined,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {ringing ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 animate-pulse bg-red-500/45" />
          <div className="relative flex flex-col items-center gap-1.5 rounded-[22px] border-[1.5px] border-red-200/65 bg-black/80 px-[22px] py-4">
            <Icon name="timer" size={22} color="#FECACA" />
            <p className="text-lg font-black tracking-[0.18em] text-red-200">TEMPS ÉCOULÉ</p>
            <p className="text-xs font-bold text-red-200/80">Le chrono a sonné</p>
          </div>
        </div>
      ) : null}
    </Arena>
  );
}

export default function BlitzPage() {
  return (
    <Suspense fallback={null}>
      <BlitzInner />
    </Suspense>
  );
}
