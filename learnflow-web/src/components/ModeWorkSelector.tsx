"use client";

import { useState } from "react";
import Spira from "@/components/Spira";
import Icon from "@/components/Icon";
import { MODE_DEFINITIONS, type AppMode } from "@/types/modes";
import { spiraMoodForMode } from "@/data/spira";
import { useAppTheme } from "@/theme/useAppTheme";

type Props = {
  selectedMode?: AppMode | null;
  guideInactive?: boolean;
  onSelectMode: (mode: AppMode) => void;
};

export default function ModeWorkSelector({ selectedMode, guideInactive, onSelectMode }: Props) {
  const { colors } = useAppTheme();
  const [help, setHelp] = useState<string | null>(null);

  return (
    <section>
      <h2 className="mb-3.5 text-[18px] font-extrabold" style={{ color: colors.textDark }}>
        Modes
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {MODE_DEFINITIONS.map((def) => {
          const inactive = def.id === "guide" && guideInactive;
          const selected = selectedMode === def.id;
          return (
            <button
              key={def.id}
              type="button"
              onClick={() => {
                if (inactive) {
                  setHelp("Aucune carte due aujourd'hui.");
                  return;
                }
                setHelp(null);
                onSelectMode(def.id);
              }}
              className="min-h-[128px] rounded-3xl p-[18px] text-left transition"
              style={{
                background: def.bg,
                border: `${selected ? 2 : 1}px solid ${selected ? def.color : def.border}`,
                opacity: inactive ? 0.5 : 1,
              }}
            >
              <div className="mb-3.5 flex items-start justify-between">
                <span className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-[18px] bg-white">
                  <Spira mood={spiraMoodForMode(def.id)} size={40} message="" />
                </span>
                {inactive ? <Icon name="alert-circle" size={16} color="#94A3B8" /> : null}
              </div>
              <p className="text-[16px] font-extrabold" style={{ color: inactive ? "#94A3B8" : def.color }}>
                {def.label.replace("Mode ", "").replace(" 60s", "")}
              </p>
            </button>
          );
        })}
      </div>
      {help ? (
        <div className="mt-3.5 flex items-start gap-2 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
          <Icon name="lightbulb" size={14} color="#F59E0B" />
          <p className="flex-1 text-sm font-semibold text-[#92400E]">{help}</p>
          <button type="button" onClick={() => setHelp(null)} aria-label="Fermer">
            <Icon name="x" size={14} color="#92400E" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
