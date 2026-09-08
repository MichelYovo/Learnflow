"use client";

import { useState, type ReactNode } from "react";
import Phone from "../phone/Phone";
import { playSfx, preloadSfx, type SfxKind } from "../../lib/sfx";

export type ExplainItem = {
  id: string;
  n?: string;
  title: string;
  body: string;
  sfx: SfxKind;
  anim: "pop" | "shake" | "win";
  glow?: "blue" | "green" | "amber" | "red";
  dark?: boolean;
  label: string;
  screen: (playKey: number) => ReactNode;
};

type Props = {
  items: ExplainItem[];
  columns?: 1 | 2;
};

export default function ExplainShowcase({ items, columns = 1 }: Props) {
  const [id, setId] = useState(items[0]?.id ?? "");
  const [playKey, setPlayKey] = useState(0);
  const current = items.find((it) => it.id === id) ?? items[0];

  const play = (item: ExplainItem) => {
    preloadSfx();
    playSfx(item.sfx);
    setId(item.id);
    setPlayKey((k) => k + 1);
  };

  if (!current) return null;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_340px]">
      <div className={columns === 2 ? "grid gap-4 sm:grid-cols-2" : "space-y-3"}>
        {items.map((item) => {
          const on = item.id === id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => play(item)}
              className={`w-full rounded-[24px] border-2 p-5 text-left transition ${
                on ? "border-[#1677FF] bg-[#E6F4FF] shadow-[0_12px_32px_rgba(22,119,255,.16)]" : "border-[#F0EFEE] bg-white hover:border-[#BAE0FF]"
              }`}
            >
              <div className="flex items-start gap-3">
                {item.n ? (
                  <span
                    className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      on ? "bg-[#1677FF] text-white" : "bg-[#E6F4FF] text-[#1677FF]"
                    }`}
                  >
                    {item.n}
                  </span>
                ) : (
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${on ? "bg-[#1677FF]" : "bg-[#BAE0FF]"}`} />
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-[#1C1917]">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-[#64748B]">{item.body}</p>
                  {on ? (
                    <p className="mt-2 text-[11px] font-extrabold uppercase tracking-wide text-[#1677FF]">Sur le téléphone →</p>
                  ) : (
                    <p className="mt-2 text-[11px] font-bold text-[#A8A29E]">Clique pour voir</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => play(current)}
          className="cursor-pointer rounded-[28px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BAE0FF]"
          aria-label="Relancer l’animation"
        >
          <div key={playKey} className={`lf-demo-phone lf-anim-${current.anim}`}>
            <Phone glow={current.glow ?? "blue"} dark={current.dark} label={current.label}>
              {current.screen(playKey)}
            </Phone>
          </div>
        </button>
        <p className="mt-4 text-center text-xs font-semibold text-[#A8A29E]">Clique une case — le téléphone s’anime.</p>
      </div>
    </div>
  );
}
