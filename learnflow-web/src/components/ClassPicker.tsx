"use client";

import { CLASS_GROUPS } from "@/data/classes";
import type { ClasseAPC } from "@/types/learnflow";
import { useAppTheme } from "@/theme/useAppTheme";

export default function ClassPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: ClasseAPC) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <div className="space-y-3">
      {CLASS_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.classes.map((c) => {
              const on = value === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange(c.id)}
                  className="rounded-[14px] border-2 px-3.5 py-2.5 text-[13px] font-extrabold"
                  style={{
                    borderColor: on ? colors.primary : colors.border,
                    background: on ? colors.mathsBg : colors.white,
                    color: on ? colors.primary : colors.textMuted,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
