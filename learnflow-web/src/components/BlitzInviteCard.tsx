"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

type Props = {
  difficulte: string;
  codeInput: string;
  onCodeInput: (value: string) => void;
  onJoin: () => void;
  onInvite: () => void;
  incoming?: boolean;
  busy?: boolean;
  joinError?: string;
};

export default function BlitzInviteCard({
  difficulte,
  codeInput,
  onCodeInput,
  onJoin,
  onInvite,
  incoming,
  busy,
  joinError,
}: Props) {
  const [copiedHint, setCopiedHint] = useState(false);

  return (
    <div
      className="w-full overflow-hidden rounded-[28px] border-2 text-left"
      style={{
        background: "linear-gradient(180deg, rgba(127,29,29,0.55) 0%, rgba(0,0,0,0.55) 100%)",
        borderColor: incoming ? "rgba(251,191,36,0.7)" : "rgba(251,146,60,0.45)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.18em]"
        style={{ background: "repeating-linear-gradient(-45deg, #F59E0B 0 10px, #111 10px 20px)" }}
      >
        <span className="rounded-full bg-black/70 px-2.5 py-1 text-[#FDE68A]">Duel Blitz</span>
        <span className="rounded-full bg-black/70 px-2.5 py-1 text-white">{difficulte}</span>
      </div>

      <div className="space-y-3 px-4 py-4 md:px-5 md:py-5">
        {incoming ? (
          <p className="rounded-2xl bg-amber-400/15 px-3 py-2 text-center text-sm font-extrabold text-amber-200">
            Un ami t&apos;attend dans l&apos;arène
          </p>
        ) : null}

        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15">
            <Icon name="users" size={18} color="#FDE68A" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Arène à deux</p>
            <p className="mt-0.5 text-sm font-semibold text-red-100/75">
              Invite un ami : vous jouez en même temps, même questions, même chrono.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setCopiedHint(true);
            window.setTimeout(() => setCopiedHint(false), 1600);
            onInvite();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-white disabled:opacity-60"
          style={{ background: "#25D366" }}
        >
          <Icon name="share" size={16} color="#fff" />
          {busy ? "Ouverture de l'arène…" : copiedHint ? "C'est parti" : "Inviter un ami"}
        </button>

        <div className="border-t border-white/10 pt-3">
          <p className="mb-2 text-center text-[11px] font-black uppercase tracking-[0.16em] text-white/50">
            On t&apos;a défié ?
          </p>
          <form
            className="flex flex-col gap-2 min-[420px]:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              onJoin();
            }}
          >
            <input
              value={codeInput}
              onChange={(e) => onCodeInput(e.target.value.toUpperCase())}
              placeholder="Colle le code du rival"
              className="min-h-12 min-w-0 w-full rounded-2xl border border-amber-300/35 bg-black/40 px-4 text-sm font-bold uppercase tracking-widest text-white outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-white/35 min-[420px]:flex-1 md:min-h-14"
            />
            <button
              type="submit"
              disabled={busy}
              className="min-h-12 shrink-0 rounded-2xl bg-[#F59E0B] px-4 text-sm font-black text-[#111] disabled:opacity-60 min-[420px]:px-5"
            >
              Entrer
            </button>
          </form>
          {joinError ? <p className="mt-2 text-center text-xs font-bold text-red-300">{joinError}</p> : null}
        </div>
      </div>
    </div>
  );
}
