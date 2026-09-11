"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import BlitzInviteCard from "@/components/BlitzInviteCard";
import BlitzDuelHud from "@/components/BlitzDuelHud";
import { BLITZ_DIFFICULTES, blitzDeck, blitzShareText, blitzWhatsAppUrl } from "@/engine/blitzChallenge";
import { BlitzDuelSession, duelShareLink, extractDuelCode, type DuelState } from "@/engine/blitzDuel";
import { playSfx, preloadSfx } from "@/lib/sfx";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import type { DifficulteFlash } from "@/types/learnflow";

const DURATION = 60;
const DIFF_META: Record<DifficulteFlash, { color: string; hint: string }> = {
  Facile: { color: "#34D399", hint: "Échauffement — tu chauffes le chrono" },
  Moyen: { color: "#FBBF24", hint: "Mix standard — le rythme Blitz" },
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
  variant = "play",
}: {
  progress: number;
  critical: boolean;
  warning: boolean;
  label: string;
  variant?: "play" | "hero";
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, progress)));
  const stroke = critical ? "#F87171" : warning ? "#FBBF24" : "#F59E0B";
  const box =
    variant === "hero"
      ? "h-[clamp(4.5rem,22vmin,9rem)] w-[clamp(4.5rem,22vmin,9rem)]"
      : "h-[clamp(3.25rem,12.5vmin,5.25rem)] w-[clamp(3.25rem,12.5vmin,5.25rem)]";
  const num =
    variant === "hero"
      ? "text-[clamp(1.5rem,6vmin,2.75rem)]"
      : "text-[clamp(1.05rem,4.2vmin,1.75rem)]";
  return (
    <div className={`relative shrink-0 ${box}`}>
      <svg viewBox="0 0 140 140" className={`h-full w-full ${critical ? "animate-pulse" : ""}`} aria-hidden>
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
        <span className={`${num} font-black leading-none`}>{label}</span>
        <span className="mt-0.5 text-[8px] font-extrabold uppercase tracking-[0.16em] text-white/50 sm:text-[10px]">sec</span>
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
      className="fixed inset-0 z-50 flex h-dvh max-h-dvh min-h-0 w-full max-w-[100vw] flex-col overflow-hidden text-white"
      style={{
        background: critical
          ? "linear-gradient(135deg, #6B0A12 0%, #1A0004 48%, #4A0810 100%)"
          : "linear-gradient(135deg, #3B070C 0%, #090001 48%, #1A0206 100%)",
      }}
    >
      <HazardTape />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
      <HazardTape />
    </div>
  );
}

const BLITZ_PAD =
  "pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]";

function BlitzInner() {
  const router = useRouter();
  const search = useSearchParams();
  const recordBlitz = useLearnFlowStore((s) => s.recordBlitz);
  const setBlitzDifficulte = useLearnFlowStore((s) => s.setBlitzDifficulte);
  const shareOk = useLearnFlowStore((s) => s.settings.privacy.shareBlitzScores);
  const incomingDuel = search.get("duel") ?? undefined;
  const startDeck = useMemo(() => {
    const d =
      (search.get("difficulte") as DifficulteFlash | null) ??
      useLearnFlowStore.getState().settings.blitzDifficulte ??
      "Moyen";
    return blitzDeck(undefined, d);
  }, [search]);
  const [deck, setDeck] = useState(startDeck);
  const [difficulte, setDifficulte] = useState<DifficulteFlash>(startDeck.difficulte);
  const [codeInput, setCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [duelBusy, setDuelBusy] = useState(false);
  const [duel, setDuel] = useState<DuelState | null>(null);
  const [phase, setPhase] = useState<"ready" | "lobby" | "countdown" | "playing" | "done">("ready");
  const [countLeft, setCountLeft] = useState(3);
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
  const duelSessionRef = useRef<BlitzDuelSession | null>(null);
  const playStartedFor = useRef<number | null>(null);
  const autoJoinRef = useRef(false);
  scoreRef.current = score;
  answeredRef.current = answered;

  const leaveDuel = () => {
    duelSessionRef.current?.leave();
    duelSessionRef.current = null;
    setDuel(null);
    setCountLeft(3);
    playStartedFor.current = null;
  };

  useEffect(() => {
    preloadSfx();
    return () => {
      duelSessionRef.current?.leave();
    };
  }, []);

  const onDuelUpdate = (state: DuelState) => {
    setDuel(state);
  };

  const inviteDuel = async () => {
    setDuelBusy(true);
    setJoinError("");
    leaveDuel();
    const next = blitzDeck(undefined, difficulte);
    const name = useLearnFlowStore.getState().getActiveProfile().nom;
    const session = await BlitzDuelSession.host({
      code: next.code,
      seed: next.seed,
      difficulte: next.difficulte,
      name,
      onUpdate: onDuelUpdate,
    });
    setDuelBusy(false);
    if ("error" in session) {
      setJoinError(session.error);
      return null;
    }
    duelSessionRef.current = session;
    setDeck(next);
    setDuel(session.snapshot());
    setPhase("lobby");
    return session;
  };

  const joinDuel = async (raw: string) => {
    const code = extractDuelCode(raw) ?? raw;
    setDuelBusy(true);
    setJoinError("");
    const name = useLearnFlowStore.getState().getActiveProfile().nom;
    leaveDuel();
    const session = await BlitzDuelSession.join({ code, name, onUpdate: onDuelUpdate });
    setDuelBusy(false);
    if ("error" in session) {
      setJoinError(session.error);
      return false;
    }
    duelSessionRef.current = session;
    const snap = session.snapshot();
    setDeck(blitzDeck(snap.seed, snap.difficulte));
    setDifficulte(snap.difficulte);
    setBlitzDifficulte(snap.difficulte);
    setDuel(snap);
    setCodeInput("");
    setPhase((current) => {
      if (current === "playing" || current === "countdown" || current === "done") return current;
      if (snap.startedAt && snap.startedAt <= Date.now()) return "playing";
      if (snap.startedAt) return "countdown";
      return "lobby";
    });
    return true;
  };

  useEffect(() => {
    if (!incomingDuel || autoJoinRef.current) return;
    autoJoinRef.current = true;
    void joinDuel(incomingDuel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingDuel]);

  useEffect(() => {
    if (!duel?.startedAt) return;
    if (phase === "playing" || phase === "done") return;
    const startedAt = duel.startedAt;
    const tick = () => {
      const ms = startedAt - Date.now();
      if (ms > 0) {
        setCountLeft(Math.ceil(ms / 1000));
        setPhase("countdown");
        return;
      }
      if (playStartedFor.current !== startedAt) {
        playStartedFor.current = startedAt;
        endedRef.current = false;
        warnedRef.current = false;
        setRinging(false);
        setScore(0);
        setAnswered(0);
        setQIdx(0);
        setSelected(null);
        setTimeLeft(DURATION);
      }
      setPhase("playing");
    };
    tick();
    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [duel?.startedAt, phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    endedRef.current = false;
    warnedRef.current = false;
    const started = duel?.startedAt && playStartedFor.current === duel.startedAt ? duel.startedAt : Date.now();
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
  }, [phase, duel?.startedAt]);

  useEffect(() => {
    if (!ringing) return;
    const t = setTimeout(() => {
      const gained = recordBlitz(scoreRef.current, answeredRef.current, difficulte);
      setXp(gained);
      setPhase("done");
      setRinging(false);
      void duelSessionRef.current?.report(scoreRef.current, answeredRef.current, true);
    }, 1150);
    return () => clearTimeout(t);
  }, [ringing, difficulte, recordBlitz]);

  useEffect(() => {
    if (!duel || (phase !== "playing" && phase !== "done")) return;
    void duelSessionRef.current?.report(score, answered, phase === "done");
  }, [score, answered, phase, duel]);

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

  const share = (withScore = false, liveState: DuelState | null = duel) => {
    const live = Boolean(liveState);
    const text = blitzShareText({
      code: liveState?.code ?? deck.code,
      difficulte: (liveState?.difficulte ?? deck.difficulte) as DifficulteFlash,
      live,
      link: live ? duelShareLink(liveState?.code ?? deck.code) : undefined,
      score: withScore && shareOk ? score : undefined,
      answered: withScore && shareOk ? answered : undefined,
      rivalName: withScore ? liveState?.rival?.name : undefined,
      rivalScore: withScore && shareOk ? liveState?.rival?.score : undefined,
    });
    const wa = blitzWhatsAppUrl(text);
    const title = live ? "Duel Blitz LearnFlow" : "Blitz LearnFlow";
    if (navigator.share) void navigator.share({ text, title }).catch(() => window.open(wa, "_blank"));
    else window.open(wa, "_blank");
  };

  const startSolo = () => {
    leaveDuel();
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

  const goHome = () => {
    leaveDuel();
    router.push("/app");
  };

  const hud = duel ? (
    <BlitzDuelHud
      me={{ name: duel.me.name, score, answered, done: phase === "done" }}
      rival={
        duel.rival
          ? { name: duel.rival.name, score: duel.rival.score, answered: duel.rival.answered, done: duel.rival.done }
          : null
      }
      code={phase === "lobby" || phase === "countdown" ? duel.code : undefined}
    />
  ) : null;

  if (phase === "ready") {
    return (
      <Arena>
        <div className={`flex min-h-0 flex-1 flex-col ${BLITZ_PAD} pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))]`}>
          <button
            type="button"
            onClick={goHome}
            className="mb-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/35 bg-white/10"
            aria-label="Fermer"
          >
            <Icon name="arrow-left" size={18} color="#fff" />
          </button>

          <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="flex flex-col items-center py-1 text-center sm:py-3">
                <div className="lf-blitz-mascot">
                  <Spira scene="mode.blitz.ready" size={72} message="" />
                </div>
                <div className="mt-1 sm:mt-2">
                  <BlitzRing variant="hero" progress={1} critical warning={false} label="60" />
                </div>
                <h1 className="mt-2 text-[clamp(1.6rem,6vw,3rem)] font-black tracking-tight">Blitz</h1>
                <p className="mt-1.5 max-w-md text-[13px] font-semibold leading-snug text-red-200/70 sm:text-base">
                  60 secondes. Mix de chapitres. Entre seul, ou invite un ami pour un Duel Blitz.
                </p>
                <div className="mt-4 grid w-full grid-cols-3 gap-1.5 sm:mt-5 sm:gap-3">
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
                        }}
                        className="min-w-0 rounded-2xl border-2 px-1 py-2.5 text-[11px] font-black leading-tight sm:py-3.5 sm:text-sm md:text-base"
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
                <p className="mt-2 text-[11px] font-semibold text-red-200/55 sm:text-sm">{DIFF_META[difficulte].hint}</p>
                <div className="mt-4 w-full max-w-md sm:mt-5">
                  <BlitzInviteCard
                    difficulte={difficulte}
                    codeInput={codeInput}
                    onCodeInput={(value) => {
                      setJoinError("");
                      setCodeInput(value);
                    }}
                    onJoin={() => {
                      void joinDuel(codeInput);
                    }}
                    onInvite={() => {
                      void inviteDuel().then((session) => {
                        if (session) share(false, session.snapshot());
                      });
                    }}
                    incoming={Boolean(incomingDuel)}
                    busy={duelBusy}
                    joinError={joinError}
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-3">
              <button
                type="button"
                onClick={startSolo}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] py-3.5 text-base font-black sm:min-h-14 sm:py-4 sm:text-lg md:text-xl"
                style={{ background: "linear-gradient(90deg,#EF4444,#7F1D1D)" }}
              >
                <Icon name="flame" size={18} color="#fff" />
                Entrer dans l&apos;arène
              </button>
            </div>
          </div>
        </div>
      </Arena>
    );
  }

  if (phase === "lobby" || phase === "countdown") {
    return (
      <Arena>
        <div className={`flex min-h-0 flex-1 flex-col ${BLITZ_PAD} pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))]`}>
          <button
            type="button"
            onClick={() => {
              leaveDuel();
              setPhase("ready");
            }}
            className="mb-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/35 bg-white/10"
            aria-label="Fermer"
          >
            <Icon name="arrow-left" size={18} color="#fff" />
          </button>
          <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col items-center overflow-y-auto overscroll-contain py-2 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-300">Duel Blitz</p>
            <h1 className="mt-2 text-[clamp(1.5rem,5vw,2.25rem)] font-black">Arène collective</h1>
            <p className="mt-2 max-w-md text-sm font-semibold text-red-200/70">
              {duel?.rival
                ? "Les deux joueurs sont dans l'arène. Ça part."
                : "Envoie le code. Ton ami entre ici — vous jouez en même temps."}
            </p>
            <div className="mt-5 w-full min-w-0">{hud}</div>
            {phase === "countdown" ? (
              <p className="mt-6 text-[clamp(3rem,18vmin,5.5rem)] font-black tabular-nums text-[#FBBF24]">{countLeft}</p>
            ) : (
              <div className="mt-5 w-full max-w-md">
                <p className="break-all font-black tracking-[0.18em] text-amber-200">{duel?.code}</p>
                <p className="mt-2 text-sm font-semibold text-red-100/70">{duelBusy ? "Connexion…" : "En attente du rival"}</p>
                <button
                  type="button"
                  onClick={() => share(false)}
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-white"
                  style={{ background: "#25D366" }}
                >
                  <Icon name="share" size={16} color="#fff" />
                  Envoie l&apos;invitation
                </button>
              </div>
            )}
          </div>
        </div>
      </Arena>
    );
  }

  if (phase === "done") {
    const survived = score >= Math.max(1, Math.floor(answered * 0.6));
    const rivalScore = duel?.rival?.score ?? null;
    const rivalDone = duel?.rival?.done ?? false;
    const duelOutcome =
      !duel || rivalScore == null
        ? null
        : !rivalDone
          ? "pending"
          : score > rivalScore
            ? "win"
            : score < rivalScore
              ? "lose"
              : "draw";
    return (
      <Arena>
        <div className={`mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col ${BLITZ_PAD} overflow-y-auto overscroll-contain py-4 text-center`}>
          <span
            className="mb-3 inline-flex items-center justify-center gap-1.5 self-center rounded-full border px-3 py-1.5 text-[10px] font-extrabold tracking-[0.14em] sm:text-[11px]"
            style={{
              color: "#FBBF24",
              borderColor: duelOutcome === "win" || survived ? "rgba(249,115,22,0.55)" : "rgba(245,158,11,0.55)",
              background: duelOutcome === "win" || survived ? "rgba(249,115,22,0.14)" : "rgba(245,158,11,0.12)",
            }}
          >
            {duel
              ? duelOutcome === "pending"
                ? "RIVAL ENCORE EN JEU"
                : duelOutcome === "win"
                  ? "TU PRENDS L'ARÈNE"
                  : duelOutcome === "lose"
                    ? "RIVAL EN TÊTE"
                    : "MATCH NUL"
              : survived
                ? "CHRONO TENU"
                : "CHRONO GAGNANT"}
          </span>
          <div className="lf-blitz-mascot mx-auto">
            <Spira
              scene={duelOutcome === "lose" ? "mode.blitz.lose" : survived || duelOutcome === "win" ? "mode.blitz.win" : "mode.blitz.lose"}
              size={96}
              message={
                duel
                  ? duelOutcome === "pending"
                    ? "Ton rival finit encore."
                    : duelOutcome === "win"
                      ? "L'arène est à toi."
                      : duelOutcome === "lose"
                        ? "Il a tenu plus juste."
                        : "Même arène, même score."
                  : survived
                    ? "60 secondes. Tu as tenu."
                    : "Le chrono t'a eu. Reviens plus affûté."
              }
            />
          </div>
          {duel ? <div className="mt-3 w-full min-w-0">{hud}</div> : null}
          <p className="mt-3 text-[clamp(2.25rem,12vw,4.5rem)] font-black leading-none">
            {score}/{answered}
          </p>
          <p className="mt-2 text-sm font-semibold text-red-200/70 sm:text-base md:text-lg">
            {duel ? "Duel Blitz" : survived ? "Le mix n'a pas eu ta peau." : "Trop lent sur cette série."} · {deck.difficulte} · +{xp} XP
          </p>
          {duel ? <p className="mt-3 break-all font-black tracking-[0.18em] text-amber-300">{duel.code}</p> : null}
          <div className="mt-6 flex w-full flex-col gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:mt-8 sm:gap-3">
            {duel ? (
              <button type="button" onClick={() => share(true)} className="min-h-12 rounded-2xl bg-[#25D366] py-3.5 text-sm font-extrabold sm:py-4 sm:text-base">
                Envoie le score sur WhatsApp
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                leaveDuel();
                setDeck(blitzDeck(undefined, difficulte));
                setTimeLeft(DURATION);
                setPhase("ready");
              }}
              className="rounded-2xl py-3 font-extrabold text-red-300"
            >
              Nouvelle série
            </button>
            <button type="button" onClick={goHome} className="rounded-2xl py-3 font-extrabold text-white/70">
              Quitter le défi
            </button>
          </div>
        </div>
      </Arena>
    );
  }

  return (
    <Arena critical={critical}>
      <div className={`flex min-h-0 min-w-0 flex-1 flex-col ${BLITZ_PAD} pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-[max(0.35rem,env(safe-area-inset-top))]`}>
        {duel ? (
          <div className="mb-2 flex min-w-0 shrink-0 flex-col items-center gap-2 sm:flex-row sm:items-center">
            <div className="min-w-0 w-full flex-1">{hud}</div>
            <BlitzRing
              variant="play"
              progress={timeLeft / DURATION}
              critical={critical}
              warning={warning}
              label={String(Math.ceil(timeLeft))}
            />
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="lf-blitz-mascot hidden shrink-0 min-[380px]:block">
              <Spira scene={critical ? "mode.blitz.panic" : "mode.blitz.play"} size={40} message="" animated={false} />
            </div>
            <BlitzRing
              variant="play"
              progress={timeLeft / DURATION}
              critical={critical}
              warning={warning}
              label={String(Math.ceil(timeLeft))}
            />
            <p className="min-w-0 flex-1 text-right text-sm font-extrabold leading-tight text-red-200/80 sm:text-base">
              {score} pts
              <span className="mt-0.5 block text-[11px] font-bold text-white/40 sm:text-xs">Q{answered + 1}</span>
            </p>
          </div>
        )}

        <p
          className={`mt-1.5 shrink-0 text-center text-[10px] font-black tracking-[0.1em] sm:mt-2 sm:text-[11px] md:text-xs ${
            critical ? "text-red-200" : warning ? "text-amber-400" : "text-white/40"
          }`}
        >
          {duel
            ? critical
              ? "ARÈNE COMMUNE — NE LÂCHE RIEN"
              : warning
                ? "Le chrono se resserre pour vous deux"
                : "Même arène. Même chrono."
            : critical
              ? "DERNIÈRES SECONDES — NE LÂCHE RIEN"
              : warning
                ? "Le chrono se resserre"
                : "Pas de retour en arrière"}
        </p>

        <div className="mx-auto mt-2 flex min-h-0 w-full min-w-0 max-w-3xl flex-1 flex-col sm:mt-3">
          <p className="shrink-0 text-[10px] font-black tracking-[0.14em] text-orange-500 sm:text-[11px] md:text-xs">
            {(q.matiere ?? "MIX").toUpperCase()} · {deck.difficulte.toUpperCase()}
            {duel ? " · DUEL" : ""}
          </p>
          <h1 className="mt-1.5 shrink-0 text-[clamp(1rem,2.6vw+0.7rem,1.85rem)] font-extrabold leading-snug">
            {q.enonceQuestion}
          </h1>
          <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain sm:mt-4 sm:gap-2.5 md:gap-3">
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
                  className="flex min-h-11 w-full min-w-0 flex-1 items-center rounded-2xl border-2 px-3 py-2 text-left text-[13px] font-bold sm:min-h-12 sm:px-4 sm:text-sm md:min-h-16 md:rounded-3xl md:px-6 md:text-lg"
                  style={{
                    borderColor: ok ? "#34D399" : ko ? "#F87171" : "rgba(239,68,68,0.28)",
                    background: ok ? "rgba(16,185,129,0.16)" : ko ? "rgba(239,68,68,0.22)" : "rgba(0,0,0,0.35)",
                    transform: ok ? "scale(1.01)" : undefined,
                  }}
                >
                  <span className="min-w-0 break-words">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {ringing ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 animate-pulse bg-red-500/45" />
          <div className="relative mx-auto flex max-w-sm flex-col items-center gap-1.5 rounded-[22px] border-[1.5px] border-red-200/65 bg-black/80 px-5 py-4 text-center">
            <Icon name="timer" size={22} color="#FECACA" />
            <p className="text-base font-black tracking-[0.18em] text-red-200 sm:text-lg">TEMPS ÉCOULÉ</p>
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
