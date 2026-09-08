"use client";

import { normalizeKeyword, parseMaskedLine, splitLessonLines } from "@/data/lessonContent";

type Props = {
  text: string;
  masked: boolean;
  revealed: Set<string>;
  onReveal: (word: string) => void;
};

export default function InteractiveLessonText({ text, masked, revealed, onReveal }: Props) {
  const lines = splitLessonLines(text);

  return (
    <div className="space-y-0 text-base leading-relaxed sm:text-lg">
      {lines.map((line, i) => {
        if (!line.trim()) {
          return <div key={`gap-${i}`} className="h-3.5" />;
        }
        const bullet = /^[•\-]\s+/.exec(line);
        const content = bullet ? line.slice(bullet[0].length) : line;
        const parsed = (
          <ParsedLine text={content} masked={masked} revealed={revealed} onReveal={onReveal} />
        );
        if (bullet) {
          return (
            <p key={`b-${i}`} className="mb-0.5 flex gap-3">
              <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1677FF]" />
              <span className="min-w-0 flex-1">{parsed}</span>
            </p>
          );
        }
        return (
          <p key={`p-${i}`} className="mb-0.5">
            {parsed}
          </p>
        );
      })}
    </div>
  );
}

function ParsedLine({
  text,
  masked,
  revealed,
  onReveal,
}: {
  text: string;
  masked: boolean;
  revealed: Set<string>;
  onReveal: (word: string) => void;
}) {
  const parts = parseMaskedLine(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === "text") {
          return <span key={i}>{p.text}</span>;
        }
        const hide = masked && !revealed.has(normalizeKeyword(p.text));
        if (hide) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onReveal(p.text)}
              className="mx-0.5 rounded bg-[#E7E5E4] px-1 font-bold tracking-widest text-[#78716C]"
              aria-label="Mot masqué, cliquer pour révéler"
            >
              ••••
            </button>
          );
        }
        return (
          <span key={i} className="font-bold text-[#1677FF]">
            {p.text}
          </span>
        );
      })}
    </>
  );
}
