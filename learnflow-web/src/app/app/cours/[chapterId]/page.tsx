"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AnalogieSpira from "@/components/AnalogieSpira";
import Icon from "@/components/Icon";
import { ScreenHeader } from "@/components/ui";
import { countWords, ficheForChapter } from "@/data/fiches";
import { chapterHas3dImage } from "@/data/schemas3d";
import { useAppTheme } from "@/theme/useAppTheme";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function apcKind(titre: string): string | null {
  const t = titre.toLowerCase();
  if (t.includes("compétence")) return "Compétence";
  if (t.includes("savoir-faire")) return "Savoir-faire";
  if (t.includes("savoir")) return "Savoirs";
  if (t.includes("exemple")) return "Exemple";
  return null;
}

export default function CoursePage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const router = useRouter();
  const fiche = ficheForChapter(chapterId);
  const { colors } = useAppTheme();
  const [speed, setSpeed] = useState<"essentiel" | "details">("essentiel");
  const [masked, setMasked] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({
    [fiche.sectionsDetaillees[0]?.id ?? ""]: true,
  });
  const words = countWords(fiche.pucesEssentiel);
  const show2d = fiche.schema === "2d" || fiche.schema === "both";
  const show3d = fiche.schema === "3d" || fiche.schema === "both" || chapterHas3dImage(chapterId);
  const analogieAfter = Math.min(1, Math.max(0, fiche.sectionsDetaillees.length - 1));

  const analogieBox = fiche.analogie ? <AnalogieSpira analogie={fiche.analogie} /> : null;

  return (
    <div>
      <ScreenHeader title={fiche.titre} backHref="/app/cours" />
      <div className="mx-auto max-w-3xl space-y-4 px-5 py-5 pb-10">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              setSpeed("essentiel");
            }}
            className="flex-1 rounded-[18px] border px-3 py-3"
            style={{
              background: speed === "essentiel" ? colors.mathsBg : colors.white,
              borderColor: speed === "essentiel" ? colors.primary : colors.border,
            }}
          >
            <p className="text-center text-[16px] font-extrabold" style={{ color: speed === "essentiel" ? colors.primary : colors.textMuted }}>
              L&apos;Essentiel
            </p>
            <p className="text-center text-[11px] font-semibold" style={{ color: speed === "essentiel" ? colors.primary : "#94A3B8" }}>
              Synthèse · {words} mots
            </p>
          </button>
          <button
            type="button"
            onClick={() => {
              setSpeed("details");
              setMasked(false);
              setRevealed(new Set());
            }}
            className="flex-1 rounded-[18px] border px-3 py-3"
            style={{
              background: speed === "details" ? colors.mathsBg : colors.white,
              borderColor: speed === "details" ? colors.primary : colors.border,
            }}
          >
            <p className="text-center text-[16px] font-extrabold" style={{ color: speed === "details" ? colors.primary : colors.textMuted }}>
              En Détails
            </p>
            <p className="text-center text-[11px] font-semibold" style={{ color: speed === "details" ? colors.primary : "#94A3B8" }}>
              Cours APC complet
            </p>
          </button>
        </div>

        {speed === "essentiel" ? (
          <>
            <button
              type="button"
              onClick={() => {
                setMasked((v) => !v);
                setRevealed(new Set());
              }}
              className="flex w-full items-center gap-3 rounded-[18px] border px-3.5 py-3 text-left"
              style={{
                background: masked ? colors.hgBg : colors.white,
                borderColor: masked ? colors.hgBorder : colors.border,
              }}
            >
              <Icon name={masked ? "eye-off" : "eye"} size={16} color={masked ? colors.accent : colors.primary} />
              <span className="flex-1">
                <span className="block text-[15px] font-extrabold">Texte masqué</span>
                <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
                  {masked ? "Appuie sur un mot pour le révéler." : "Cache les mots-clés, révèle-les au tap."}
                </span>
              </span>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold" style={{ background: masked ? colors.accent : colors.surfaceAlt, color: masked ? "#fff" : colors.textMuted }}>
                {masked ? "ON" : "OFF"}
              </span>
            </button>
            <div className="space-y-[18px] rounded-3xl px-5 py-[22px]" style={{ background: colors.white }}>
              {fiche.pucesEssentiel.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: colors.primary }} />
                  <p className="text-[16px] font-medium leading-6">
                    <RichLine text={line} keywords={fiche.motsClesMasques} masked={masked} revealed={revealed} onReveal={(w) => setRevealed(new Set(revealed).add(normalize(w)))} />
                  </p>
                </div>
              ))}
            </div>
            {analogieBox}
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1 text-[13px] font-semibold leading-[18px]" style={{ color: colors.textSecondary }}>
                Vue dépliable — cours développé, conforme aux exigences APC.
              </p>
              <button
                type="button"
                onClick={() => {
                  const shown = fiche.sectionsDetaillees.every((s) => open[s.id]);
                  const next: Record<string, boolean> = {};
                  for (const s of fiche.sectionsDetaillees) next[s.id] = !shown;
                  setOpen(next);
                }}
                className="text-[13px] font-extrabold"
                style={{ color: colors.primary }}
              >
                {fiche.sectionsDetaillees.every((s) => open[s.id]) ? "Replier tout" : "Déplier tout"}
              </button>
            </div>
            {fiche.sectionsDetaillees.map((section, idx) => {
              const shown = open[section.id] ?? false;
              const kind = apcKind(section.titre);
              return (
                <div key={section.id}>
                  {idx === analogieAfter ? analogieBox : null}
                  <div className="mt-3 overflow-hidden rounded-[20px]" style={{ background: colors.white }}>
                    <button type="button" onClick={() => setOpen((p) => ({ ...p, [section.id]: !shown }))} className="flex w-full items-center gap-2.5 px-[18px] py-4 text-left">
                      <span className="flex-1">
                        {kind ? (
                          <span className="block text-[11px] font-extrabold uppercase tracking-wide" style={{ color: colors.primary }}>
                            {kind}
                          </span>
                        ) : null}
                        <span className="block text-[16px] font-extrabold">{section.titre}</span>
                      </span>
                      <Icon name={shown ? "chevron-up" : "chevron-down"} size={18} color={colors.primary} />
                    </button>
                    {shown
                      ? section.paragraphes.map((p, pi) => (
                          <p key={pi} className="px-[18px] pb-4 text-[16px] font-medium leading-6">
                            <RichLine text={p} keywords={fiche.motsClesMasques} masked={false} revealed={revealed} onReveal={() => undefined} />
                          </p>
                        ))
                      : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {show2d || show3d ? (
          <div className="flex gap-2 rounded-3xl p-4" style={{ background: colors.svtBg }}>
            {show2d ? (
              <button type="button" onClick={() => router.push(`/app/schema/${chapterId}`)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-extrabold" style={{ background: colors.white }}>
                <Icon name="grid" size={18} color={colors.secondary} />
                Schéma 2D
              </button>
            ) : null}
            {show3d ? (
              <button type="button" onClick={() => router.push(`/app/schema3d/${chapterId}`)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-extrabold" style={{ background: colors.white }}>
                <Icon name="atom" size={18} color={colors.cyan} />
                Modèle 3D
              </button>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => router.push(`/app/quiz/assimilation/${chapterId}`)}
          className="w-full rounded-[18px] py-[18px] text-[17px] font-extrabold text-white"
          style={{ background: colors.primary }}
        >
          Passer le quizz d&apos;assimilation
        </button>
      </div>
    </div>
  );
}

function RichLine({
  text,
  keywords,
  masked,
  revealed,
  onReveal,
}: {
  text: string;
  keywords: string[];
  masked: boolean;
  revealed: Set<string>;
  onReveal: (w: string) => void;
}) {
  const parts = useMemo(() => {
    const out: { text: string; bold?: boolean }[] = [];
    const re = /\*\*([^*]+)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push({ text: text.slice(last, m.index) });
      out.push({ text: m[1], bold: true });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last) });
    return out;
  }, [text]);

  return (
    <>
      {parts.map((p, i) => {
        const hide = Boolean(masked && p.bold && keywords.some((k) => normalize(k) === normalize(p.text)) && !revealed.has(normalize(p.text)));
        if (hide) {
          return (
            <button key={i} type="button" onClick={() => onReveal(p.text)} className="mx-0.5 rounded bg-[#E7E5E4] px-1 font-bold tracking-widest text-[#78716C]">
              ••••
            </button>
          );
        }
        return (
          <span key={i} className={p.bold ? "font-bold text-[#1677FF]" : undefined}>
            {p.text}
          </span>
        );
      })}
    </>
  );
}
