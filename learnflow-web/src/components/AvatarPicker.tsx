"use client";

import { AVATARS } from "@/data/avatars";
import { useAppTheme } from "@/theme/useAppTheme";
import Avatar from "./Avatar";
import Icon from "./Icon";

export function AvatarChoiceGrid({
  selectedId,
  onSelect,
  compact,
}: {
  selectedId?: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const { colors } = useAppTheme();
  const size = compact ? 48 : 56;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {AVATARS.map((persona) => {
        const on = selectedId === persona.id;
        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona.id)}
            aria-pressed={on}
            aria-label={persona.label}
            className="flex min-w-0 flex-col items-center gap-0.5 rounded-2xl border-2 px-0.5 py-1.5 sm:px-1 sm:py-2"
            style={{
              background: on ? colors.mathsBg : "transparent",
              borderColor: on ? colors.primary : "transparent",
            }}
          >
            <Avatar avatarId={persona.id} size={size} selected={on} />
            <span className="max-w-full truncate text-[10px] font-extrabold sm:text-[11px]" style={{ color: on ? colors.primary : colors.textDark }}>
              {persona.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function AvatarPicker({
  open,
  selectedId,
  onSelect,
  onClose,
  required,
}: {
  open: boolean;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  required?: boolean;
}) {
  const { colors } = useAppTheme();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden md:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45"
        onClick={required ? undefined : onClose}
        aria-label={required ? undefined : "Fermer"}
      />
      <div
        className="relative z-10 flex max-h-[min(88dvh,40rem)] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] px-4 pt-2 md:rounded-[28px] md:p-5"
        style={{ background: colors.white, paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full md:hidden" style={{ background: colors.borderStrong }} />
        <div className="mb-3 flex shrink-0 items-start gap-3 px-1">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold" style={{ color: colors.textDark }}>
              Choisis ta personnalité
            </p>
            <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
              Une mascotte à toi — son look change avec ton rang de ligue.
            </p>
          </div>
          {required ? null : (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: colors.surfaceAlt }}
              aria-label="Fermer"
            >
              <Icon name="x" size={16} color={colors.textDark} />
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-1">
          <AvatarChoiceGrid
            selectedId={selectedId}
            onSelect={(id) => {
              onSelect(id);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
