"use client";

import { useMemo, useState } from "react";
import { AI_FAQ, findAiFaq } from "@/data/mock";
import { useAppTheme } from "@/theme/useAppTheme";
import Icon from "./Icon";
import Spira from "./Spira";

export default function FloatingChatbot() {
  const { colors, darkMode } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const hints = useMemo(() => AI_FAQ.slice(0, 5), []);

  const ask = (q: string) => {
    setQuery(q);
    const faq = findAiFaq(q);
    setAnswer(faq?.a ?? "Je n'ai que la FAQ locale ici. Essaie : discriminant, 10/10, Blitz, Mode Guidé, Spira.");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
          className="fixed right-[max(12px,env(safe-area-inset-right))] bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg sm:h-14 sm:w-14 lg:bottom-6 lg:right-6"
          style={{ background: colors.primary }}
          aria-label="Tuteur local"
          data-tour="tuteur"
        >
          <Icon name={open ? "x" : "message"} size={22} color="#fff" />
        </button>
        {open ? (
          <div
            className="fixed inset-x-2 bottom-[calc(8.5rem+env(safe-area-inset-bottom,0px))] z-50 mx-auto w-[min(360px,calc(100vw-1rem))] max-h-[min(70dvh,28rem)] overflow-hidden rounded-3xl border shadow-xl sm:inset-x-auto sm:right-[max(8px,env(safe-area-inset-right))] sm:left-auto lg:bottom-24 lg:right-6"
          style={{
            background: colors.white,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: colors.border }}>
            <Spira scene="tutor.ready" size={44} message="" animated={false} />
            <div>
              <p className="text-sm font-extrabold">Tuteur local</p>
              <p className="text-xs font-semibold" style={{ color: colors.textMuted }}>
                FAQ hors ligne · illimitée
              </p>
            </div>
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto p-4">
            {answer ? (
              <p className="rounded-2xl px-3 py-2 text-sm font-medium" style={{ background: darkMode ? "#0C1A33" : "#E6F4FF" }}>
                {answer}
              </p>
            ) : (
              hints.map((h) => (
                <button
                  key={h.q}
                  type="button"
                  onClick={() => ask(h.q)}
                  className="block w-full rounded-2xl border px-3 py-2 text-left text-sm font-semibold"
                  style={{ borderColor: colors.border }}
                >
                  {h.q}
                </button>
              ))
            )}
          </div>
          <form
            className="flex gap-2 border-t p-3"
            style={{ borderColor: colors.border }}
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) ask(query);
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Une question…"
              className="flex-1 rounded-xl border px-3 py-2 text-sm font-medium outline-none"
              style={{ borderColor: colors.border, background: colors.surface, color: colors.textDark }}
            />
            <button type="submit" className="rounded-xl px-3 py-2 text-sm font-extrabold text-white" style={{ background: colors.primary }}>
              OK
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
