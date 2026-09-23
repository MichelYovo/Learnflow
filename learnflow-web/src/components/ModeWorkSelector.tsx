"use client";

import { useState } from "react";
import ModeMascot from "@/components/ModeMascot";
import Icon from "@/components/Icon";
import { MODE_DEFINITIONS, type AppMode } from "@/types/modes";
import { modeCardSurface } from "@/theme/palette";
import { useAppTheme } from "@/theme/useAppTheme";

type Props = {
  selectedMode?: AppMode | null;
  guideInactive?: boolean;
  onSelectMode: (mode: AppMode) => void;
};

export default function ModeWorkSelector({ selectedMode, guideInactive, onSelectMode }: Props) {
  const { colors, darkMode } = useAppTheme();
  const [help, setHelp] = useState<string | null>(null);

  return (
    <section data-tour="modes" aria-labelledby="modes-heading">
      <h2
        id="modes-heading"
        className="mb-3.5 text-base font-extrabold"
        style={{ color: colors.textDark }}
      >
        Modes
      </h2>
      <div
        className="grid grid-cols-2 gap-3 min-[380px]:gap-3.5 md:grid-cols-4"
        role="radiogroup"
        aria-label="Mode de travail"
      >
        {MODE_DEFINITIONS.map((def) => {
          const inactive = def.id === "guide" && guideInactive;
          const selected = selectedMode === def.id;
          const surface = modeCardSurface(def.bg, def.border, def.color, darkMode);
          const label = def.label.replace("Mode ", "").replace(" 60s", "");

          return (
            <button
              key={def.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={inactive}
              aria-label={inactive ? `${label} — indisponible : aucune carte due` : label}
              onClick={() => {
                if (inactive) {
                  setHelp("Aucune carte due aujourd'hui.");
                  return;
                }
                setHelp(null);
                onSelectMode(def.id);
              }}
              className={`lf-mode-btn group relative flex min-h-[148px] min-w-0 flex-col items-center justify-end overflow-visible px-2 pb-3 pt-2 text-center min-[380px]:min-h-[160px] min-[380px]:px-2.5 min-[380px]:pb-3.5 sm:min-h-[176px] sm:px-3 sm:pb-4 ${
                inactive ? "lf-mode-btn--disabled cursor-not-allowed" : ""
              } ${selected ? "lf-mode-btn--selected" : ""}`}
              style={{
                background: surface.background,
                border: `1px solid ${selected ? def.color : surface.border}`,
                opacity: inactive ? 0.55 : 1,
              }}
            >
              {inactive ? (
                <span className="absolute right-2.5 top-2.5 z-10">
                  <Icon name="alert-circle" size={16} color="#94A3B8" />
                </span>
              ) : null}

              <span className="lf-mode-btn__mascot flex min-h-0 w-full flex-1 items-end justify-center pb-1 pt-1">
                <ModeMascot mode={def.id} size={112} />
              </span>

              <p
                className="relative z-[1] w-full truncate text-base font-extrabold leading-tight"
                style={{ color: inactive ? "#94A3B8" : def.color }}
              >
                {label}
              </p>
            </button>
          );
        })}
      </div>
      {help ? (
        <div
          role="status"
          className="mt-3.5 flex items-start gap-2 rounded-2xl border p-3.5"
          style={{ borderColor: colors.hgBorder, background: colors.hgBg }}
        >
          <Icon name="lightbulb" size={14} color={colors.accent} />
          <p className="flex-1 text-sm font-semibold" style={{ color: colors.accent }}>
            {help}
          </p>
          <button type="button" onClick={() => setHelp(null)} aria-label="Fermer">
            <Icon name="x" size={14} color={colors.accent} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
