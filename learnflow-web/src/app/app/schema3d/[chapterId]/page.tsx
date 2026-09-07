"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ScreenHeader } from "@/components/ui";
import { usePublishedCatalog } from "@/data/publishedCache";
import { schemas3dForChapter } from "@/data/schemas3d";
import { useAppTheme } from "@/theme/useAppTheme";

export default function Schema3DPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { colors } = useAppTheme();
  const catalogEpoch = usePublishedCatalog();
  const models = useMemo(() => schemas3dForChapter(chapterId), [chapterId, catalogEpoch]);
  const [idx, setIdx] = useState(0);
  const [partId, setPartId] = useState<string | null>(null);
  const model = models[idx];

  if (!model) {
    return (
      <div>
        <ScreenHeader title="Schéma 3D" backHref={`/app/cours/${chapterId}`} />
        <p className="p-8 text-center font-semibold" style={{ color: colors.textMuted }}>
          Pas de modèle 3D pour ce chapitre.
        </p>
      </div>
    );
  }

  const part = model.parts.find((p) => p.id === partId) ?? model.parts[0];

  return (
    <div>
      <ScreenHeader title={model.title} backHref={`/app/cours/${chapterId}`} />
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
        <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
          {model.subtitle}
        </p>
        {models.length > 1 ? (
          <div className="mt-3 flex gap-2">
            {models.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setIdx(i);
                  setPartId(null);
                }}
                className="rounded-full px-3 py-1.5 text-xs font-extrabold"
                style={{ background: i === idx ? colors.primary : colors.surfaceAlt, color: i === idx ? "#fff" : colors.textDark }}
              >
                {m.title}
              </button>
            ))}
          </div>
        ) : null}
        <div className="relative mt-4 overflow-hidden rounded-3xl" style={{ background: colors.white }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={model.image} alt={model.title} className="w-full object-contain" />
          {model.parts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPartId(p.id)}
              className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: partId === p.id ? colors.primary : "#10B981",
              }}
              aria-label={p.label}
            />
          ))}
        </div>
        <div className="mt-4 rounded-2xl border p-4" style={{ background: colors.white, borderColor: colors.border }}>
          <p className="font-extrabold">{part.label}</p>
          <p className="mt-1 text-sm font-medium" style={{ color: colors.textSecondary }}>
            {part.role}
          </p>
        </div>
      </div>
    </div>
  );
}
