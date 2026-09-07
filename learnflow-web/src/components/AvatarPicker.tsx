"use client";

import { AVATAR_IDS } from "@/data/avatars";
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
  const size = compact ? 56 : 64;
  return (
    <div className="flex flex-wrap">
      {AVATAR_IDS.map((id, i) => {
        const on = selectedId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={on}
            aria-label={`Avatar ${i + 1}`}
            className="flex w-1/5 items-center justify-center rounded-2xl border-2 py-2"
            style={{
              background: on ? colors.mathsBg : "transparent",
              borderColor: on ? colors.primary : "transparent",
            }}
          >
            <Avatar avatarId={id} size={size} selected={on} />
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
}: {
  open: boolean;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { colors } = useAppTheme();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button type="button" className="absolute inset-0 bg-slate-900/45" onClick={onClose} aria-label="Fermer" />
      <div
        className="relative z-10 w-full max-w-md rounded-t-[28px] px-4 pb-5 pt-2 md:rounded-[28px] md:p-5"
        style={{ background: colors.white, paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full md:hidden" style={{ background: colors.borderStrong }} />
        <div className="mb-3 flex items-start gap-3 px-1">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold" style={{ color: colors.textDark }}>
              Choisis ton avatar
            </p>
            <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
              10 visages d’élèves — il t’identifie partout dans l’app.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: colors.surfaceAlt }}
            aria-label="Fermer"
          >
            <Icon name="x" size={16} color={colors.textDark} />
          </button>
        </div>
        <AvatarChoiceGrid
          selectedId={selectedId}
          onSelect={(id) => {
            onSelect(id);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
