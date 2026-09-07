"use client";

import { useState } from "react";
import { AppMain, ScreenHeader } from "@/components/ui";
import Spira from "@/components/Spira";
import { AI_FAQ } from "@/data/mock";
import { askTutor, AI_DAILY_QUOTA } from "@/data/tutor";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function TutorPage() {
  const { colors } = useAppTheme();
  const consumeAiQuota = useLearnFlowStore((s) => s.consumeAiQuota);
  const getAiQuotaRestant = useLearnFlowStore((s) => s.getAiQuotaRestant);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const restant = getAiQuotaRestant();

  const send = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const reply = askTutor(text, consumeAiQuota);
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: reply.text }]);
    setQuery("");
  };

  return (
    <div>
      <ScreenHeader title="Tuteur IA" backHref="/app" />
      <AppMain className="flex flex-col gap-4 py-6">
        <div className="flex items-center gap-3">
          <Spira scene={restant > 0 ? "tutor.ready" : "tutor.exhausted"} size={64} message="" />
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            FAQ locale illimitée · {restant}/{AI_DAILY_QUOTA} questions cloud aujourd&apos;hui
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {AI_FAQ.slice(0, 6).map((f) => (
            <button
              key={f.q}
              type="button"
              onClick={() => send(f.q)}
              className="rounded-full border px-3 py-1.5 text-xs font-bold"
              style={{ borderColor: colors.border, background: colors.white }}
            >
              {f.q}
            </button>
          ))}
        </div>
        <div className="min-h-[240px] space-y-2 rounded-3xl border p-4" style={{ background: colors.white, borderColor: colors.border }}>
          {messages.length === 0 ? (
            <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              Pose une question, ou choisis une suggestion.
            </p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm font-medium ${m.role === "user" ? "ml-auto" : ""}`}
                style={{
                  background: m.role === "user" ? colors.primary : colors.surfaceAlt,
                  color: m.role === "user" ? "#fff" : colors.textDark,
                }}
              >
                {m.text}
              </div>
            ))
          )}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(query);
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold outline-none"
            style={{ borderColor: colors.border, background: colors.white, color: colors.textDark }}
            placeholder="Ex. c'est quoi le discriminant ?"
          />
          <button type="submit" className="rounded-2xl px-4 font-extrabold text-white" style={{ background: colors.primary }}>
            Envoyer
          </button>
        </form>
      </AppMain>
    </div>
  );
}
