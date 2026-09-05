"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScreenHeader, PrimaryButton } from "@/components/ui";
import { DIGEST_HOTSPOTS } from "@/data/modeContent";
import { useAppTheme } from "@/theme/useAppTheme";

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Schema2DPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const [labels] = useState(() => shuffle(DIGEST_HOTSPOTS.map((h) => h.label)));
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const used = new Set(Object.values(pairs));
  const allPlaced = Object.keys(pairs).length === DIGEST_HOTSPOTS.length;
  const score = DIGEST_HOTSPOTS.filter((h) => pairs[h.id] === h.label).length;

  return (
    <div>
      <ScreenHeader title="Schéma 2D · digestion" backHref={`/app/cours/${chapterId}`} />
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <div className="relative h-[420px] overflow-hidden rounded-3xl" style={{ background: "#ECFDF5" }}>
          <div className="absolute left-1/2 top-8 h-[70%] w-3 -translate-x-1/2 rounded-full" style={{ background: "#A7F3D0" }} />
          {DIGEST_HOTSPOTS.map((h) => {
            const placed = pairs[h.id];
            const ok = checked && placed === h.label;
            const ko = checked && placed && placed !== h.label;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => !checked && setSelectedSpot(h.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[11px] font-extrabold"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  background: ok ? "#10B981" : ko ? "#EF4444" : selectedSpot === h.id ? "#1677FF" : "#fff",
                  color: ok || ko || selectedSpot === h.id ? "#fff" : colors.textDark,
                  borderColor: "#A7F3D0",
                }}
              >
                {placed ?? "?"}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {labels.map((label) => (
            <button
              key={label}
              type="button"
              disabled={used.has(label) || !selectedSpot || checked}
              onClick={() => {
                if (!selectedSpot) return;
                setPairs((p) => ({ ...p, [selectedSpot]: label }));
                setSelectedSpot(null);
              }}
              className="rounded-full border px-3 py-1.5 text-xs font-extrabold disabled:opacity-40"
              style={{ borderColor: colors.svtBorder, background: colors.white }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {checked ? (
            <p className="mb-3 text-center font-extrabold">
              {score}/{DIGEST_HOTSPOTS.length}
            </p>
          ) : null}
          <PrimaryButton
            onClick={() => {
              if (checked) router.push(`/app/cours/${chapterId}`);
              else if (allPlaced) setChecked(true);
            }}
            disabled={!allPlaced && !checked}
          >
            {checked ? "OK" : "Vérifier"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
