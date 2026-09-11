"use client";

import { useAppTheme } from "@/theme/useAppTheme";
import { normalizeTogoLocal, TOGO_PREFIX } from "@/lib/phoneTogo";

export const PARENT_PHONE_LABEL = "WhatsApp de ton père, ta mère ou ton tuteur";
export const PARENT_PHONE_HINT =
  "Pas ton numéro. LearnFlow envoie un message d’accueil à ce parent, puis un petit point sur tes progrès (toutes les 1 à 2 semaines).";
export const PARENT_PHONE_CONFIRM =
  "Je confirme : c’est le WhatsApp d’un parent ou tuteur, pas le mien.";

export default function ParentPhoneField({
  value,
  onChange,
  confirmed = false,
  onConfirmChange,
  className = "",
  optional = false,
}: {
  value: string;
  onChange: (local8: string) => void;
  confirmed?: boolean;
  onConfirmChange?: (v: boolean) => void;
  className?: string;
  optional?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <div className={className}>
      <label className="block">
        <span className="text-xs font-bold" style={{ color: colors.textDark }}>
          {PARENT_PHONE_LABEL}
          {optional ? " (facultatif)" : ""}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-4" style={{ color: colors.textMuted }}>
          {PARENT_PHONE_HINT}
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
            onChange={(e) => {
              onChange(normalizeTogoLocal(e.target.value));
              onConfirmChange?.(false);
            }}
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={8}
            placeholder="90xxxxxx"
            className="min-w-0 flex-1 px-3 py-3.5 text-sm font-semibold outline-none"
            style={{ background: colors.white, color: colors.textDark }}
          />
        </div>
      </label>
      {value.length > 0 && onConfirmChange ? (
        <label className="mt-2 flex items-start gap-2 rounded-2xl px-3 py-2.5" style={{ background: colors.surfaceAlt }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#1677FF]"
          />
          <span className="text-[12px] font-semibold leading-4" style={{ color: colors.textDark }}>
            {PARENT_PHONE_CONFIRM}
          </span>
        </label>
      ) : null}
    </div>
  );
}
