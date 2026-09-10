"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { blitzInviteHook } from "@/engine/blitzChallenge";
import type { DifficulteFlash } from "@/types/learnflow";

type Props = {
  code: string;
  difficulte: DifficulteFlash;
  codeInput: string;
  onCodeInput: (value: string) => void;
  onJoin: () => boolean;
  onCreate: () => void;
  onShare: () => void;
  incoming?: boolean;
  joined?: boolean;
  joinError?: string;
};

export default function BlitzInviteCard({
  code,
  difficulte,
  codeInput,
  onCodeInput,
  onJoin,
  onCreate,
  onShare,
  incoming,
  joined,
  joinError,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      onShare();
    }
  };

  return (
    <div
      className="w-full overflow-hidden rounded-[28px] border-2 text-left"
      style={{
        background: "linear-gradient(180deg, rgba(127,29,29,0.55) 0%, rgba(0,0,0,0.55) 100%)",
        borderColor: incoming || joined ? "rgba(251,191,36,0.7)" : "rgba(251,146,60,0.45)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div
        className="flex items-center justify-between gap-2 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em]"
        style={{ background: "repeating-linear-gradient(-45deg, #F59E0B 0 10px, #111 10px 20px)" }}
      >
        <span className="rounded-full bg-black/70 px-2.5 py-1 text-[#FDE68A]">Code duel</span>
        <span className="rounded-full bg-black/70 px-2.5 py-1 text-white">{difficulte}</span>
      </div>

      <div className="space-y-3 px-4 py-4 md:px-5 md:py-5">
        {incoming ? (
          <p className="rounded-2xl bg-amber-400/15 px-3 py-2 text-center text-sm font-extrabold text-amber-200">
            Un ami t&apos;attend dans l&apos;arène
          </p>
        ) : null}
        {joined ? (
          <p className="rounded-2xl bg-emerald-400/15 px-3 py-2 text-center text-sm font-extrabold text-emerald-200">
            Défi verrouillé. Même série. Prêt ?
          </p>
        ) : null}

        <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-orange-300/80">
          Ton code arène
        </p>
        <button
          type="button"
          onClick={() => void copyCode()}
          className="block w-full rounded-2xl border border-white/10 bg-black/40 py-3 text-center"
          aria-label="Copier le code"
        >
          <span className="block font-black tracking-[0.22em] text-4xl text-[#FDE68A] md:text-5xl">{code}</span>
          <span className="mt-1 block text-xs font-bold text-white/55">
            {copied ? "Copié ! Colle-le à tes potes." : "Appuie pour copier"}
          </span>
        </button>
        <p className="text-center text-sm font-semibold text-red-100/75">{blitzInviteHook(code)}</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onShare}
            className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-white"
            style={{ background: "#25D366" }}
          >
            <Icon name="share" size={16} color="#fff" />
            Envoie le duel
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-3.5 text-sm font-extrabold text-white"
          >
            <Icon name="refresh" size={16} color="#FDE68A" />
            Nouveau code
          </button>
        </div>

        <div className="border-t border-white/10 pt-3">
          <p className="mb-2 text-center text-[11px] font-black uppercase tracking-[0.16em] text-white/50">
            On t&apos;a défié ?
          </p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onJoin();
            }}
          >
            <input
              value={codeInput}
              onChange={(e) => onCodeInput(e.target.value.toUpperCase())}
              placeholder="Colle le code du rival"
              className="min-h-12 flex-1 rounded-2xl border border-amber-300/35 bg-black/40 px-4 text-sm font-bold uppercase tracking-widest text-white outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-white/35 md:min-h-14"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#F59E0B] px-4 text-sm font-black text-[#111] md:px-5"
            >
              Duel
            </button>
          </form>
          {joinError ? <p className="mt-2 text-center text-xs font-bold text-red-300">{joinError}</p> : null}
        </div>
      </div>
    </div>
  );
}
