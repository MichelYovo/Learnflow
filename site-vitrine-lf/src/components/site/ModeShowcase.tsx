"use client";

import { useState, type ReactNode } from "react";
import { MODES } from "../../lib/brand";
import Phone from "../phone/Phone";
import { BlitzMock, CourseMock, HomeMock, QuizMock } from "../phone/screens";

const SCREEN: Record<string, { dark?: boolean; glow: "blue" | "green" | "amber" | "red"; node: ReactNode }> = {
  libre: { glow: "green", node: <CourseMock /> },
  guide: { glow: "blue", node: <HomeMock /> },
  cramming: { glow: "amber", node: <QuizMock /> },
  blitz: { glow: "red", dark: true, node: <BlitzMock /> },
};

export default function ModeShowcase() {
  const [id, setId] = useState<(typeof MODES)[number]["id"]>("libre");
  const mode = MODES.find((m) => m.id === id)!;
  const screen = SCREEN[id];

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {MODES.map((m) => {
          const on = m.id === id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setId(m.id)}
              aria-pressed={on}
              className="rounded-[24px] border-2 p-5 text-left transition"
              style={{
                background: m.bg,
                borderColor: on ? m.color : m.border,
                boxShadow: on ? `0 12px 32px ${m.color}33` : "none",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[18px] bg-white">
                  <img src={`/spira/${m.spira}.png`} alt="" className="h-12 w-12 object-contain" />
                </span>
                {on ? (
                  <span className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: m.color }}>
                    Aperçu
                  </span>
                ) : null}
              </div>
              <p className="text-lg font-extrabold" style={{ color: m.color }}>
                {m.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1C1917]">{m.sub}</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B]">{m.purpose}</p>
              <p className="mt-3 text-xs font-bold" style={{ color: m.color }}>
                {m.hint}
              </p>
            </button>
          );
        })}
      </div>
      <div className="flex justify-center">
        <Phone glow={screen.glow} dark={screen.dark} float label={mode.label}>
          {screen.node}
        </Phone>
      </div>
    </div>
  );
}
