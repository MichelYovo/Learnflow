"use client";

import { useAppTheme } from "@/theme/useAppTheme";
import { normalizeTogoLocal, TOGO_PREFIX } from "@/lib/phoneTogo";

export default function ParentPhoneField({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (local8: string) => void;
  className?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-bold" style={{ color: colors.textDark }}>
        Numéro parent
      </span>
      <span className="mt-0.5 block text-[11px] font-semibold" style={{ color: colors.textMuted }}>
        Togo uniquement. Un message WhatsApp LearnFlow sera envoyé à ce numéro à chaque connexion.
      </span>
      <div className="mt-1.5 flex overflow-hidden rounded-2xl border-2" style={{ borderColor: colors.border }}>
        <span
          className="flex shrink-0 items-center px-3 text-sm font-extrabold"
          style={{ background: colors.surfaceAlt, color: colors.textDark }}
        >
          {TOGO_PREFIX}
        </span>
        <input
          value={value}
          onChange={(e) => onChange(normalizeTogoLocal(e.target.value))}
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={8}
          placeholder="90xxxxxx"
          className="min-w-0 flex-1 px-3 py-3.5 text-sm font-semibold outline-none"
          style={{ background: colors.white, color: colors.textDark }}
        />
      </div>
    </label>
  );
}
