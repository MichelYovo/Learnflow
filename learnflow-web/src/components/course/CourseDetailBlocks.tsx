"use client";

import MiniAutoEval from "@/components/course/MiniAutoEval";
import { isDetailHeading, splitDetailParas, type DetailBlocks } from "@/data/lessonContent";
import { useAppTheme } from "@/theme/useAppTheme";
import type { ReactNode } from "react";

function BlockCard({ n, label, children }: { n: number; label: string; children: ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <article className="rounded-3xl px-5 py-[22px]" style={{ background: colors.white }}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: colors.primary }}>
        {n} / 4 · {label}
      </p>
      {children}
    </article>
  );
}

export default function CourseDetailBlocks({ blocks }: { blocks: DetailBlocks }) {
  const { colors } = useAppTheme();
  const paras = splitDetailParas(blocks.developpement);

  return (
    <div className="space-y-4">
      <BlockCard n={1} label="Contexte">
        <h2 className="mt-2 text-base font-extrabold" style={{ color: colors.textDark }}>
          Situation-problème
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-relaxed sm:text-lg" style={{ color: colors.textDark }}>
          {blocks.situation.recit}
        </p>
        <p
          className="mt-3 rounded-2xl px-3.5 py-3 text-[15px] font-bold leading-snug"
          style={{ background: colors.hgBg, color: colors.textDark }}
        >
          {blocks.situation.question}
        </p>
        <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: colors.textSecondary }}>
          <span className="font-extrabold" style={{ color: colors.primary }}>
            Compétence visée.{" "}
          </span>
          {blocks.situation.competenceVisee}
        </p>
      </BlockCard>

      <BlockCard n={2} label="Savoirs & savoir-faire">
        <div className="mt-2 space-y-4">
          {paras.map((para, i) =>
            isDetailHeading(para) ? (
              <h2 key={i} className="text-base font-extrabold leading-relaxed" style={{ color: colors.primary }}>
                {para}
              </h2>
            ) : (
              <p key={i} className="whitespace-pre-wrap text-base font-medium leading-relaxed sm:text-lg" style={{ color: colors.textDark }}>
                {para}
              </p>
            ),
          )}
        </div>
      </BlockCard>

      <BlockCard n={3} label="Exemple résolu">
        <h2 className="mt-2 text-base font-extrabold" style={{ color: colors.textDark }}>
          Énoncé
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-relaxed sm:text-lg" style={{ color: colors.textDark }}>
          {blocks.exemple.enonce}
        </p>
        <ol className="mt-4 space-y-3">
          {blocks.exemple.etapes.map((etape, i) => (
            <li key={`${etape.titre}-${i}`} className="flex gap-3">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-black"
                style={{ background: colors.mathsBg, color: colors.primary }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-extrabold" style={{ color: colors.primary }}>
                  {etape.titre}
                </p>
                <p className="mt-0.5 whitespace-pre-wrap text-[15px] font-medium leading-relaxed" style={{ color: colors.textDark }}>
                  {etape.texte}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {blocks.exemple.reponseFinale ? (
          <p className="mt-4 rounded-2xl px-3.5 py-3 text-[15px] font-bold leading-snug" style={{ background: colors.svtBg, color: colors.textDark }}>
            {blocks.exemple.reponseFinale}
          </p>
        ) : null}
      </BlockCard>

      <BlockCard n={4} label="Mini-autoévaluation">
        <p className="mt-2 text-sm font-semibold" style={{ color: colors.textMuted }}>
          2 questions pour valider avant le quiz d&apos;assimilation.
        </p>
        <MiniAutoEval questions={blocks.miniQuiz} />
      </BlockCard>
    </div>
  );
}
