"use client";

import Link from "next/link";
import { useAppTheme } from "@/theme/useAppTheme";
import Icon, { type IconName } from "./Icon";

export function ScreenHeader({
  title,
  backHref,
  right,
}: {
  title: string;
  backHref?: string;
  right?: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-3 border-b px-4 py-3 md:px-8"
      style={{ background: colors.white, borderColor: colors.border }}
    >
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ background: colors.surfaceAlt }}
          aria-label="Retour"
        >
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Link>
      ) : null}
      <h1 className="flex-1 text-lg font-extrabold md:text-xl">{title}</h1>
      {right}
    </header>
  );
}

export function PrimaryButton({
  children,
  onClick,
  href,
  disabled,
  color,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  color?: string;
}) {
  const { colors } = useAppTheme();
  const className =
    "inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-extrabold text-white disabled:opacity-50";
  const style = { background: `linear-gradient(90deg, ${color ?? colors.primary}, ${colors.primaryDark})` };
  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className} style={style}>
      {children}
    </button>
  );
}

export function CardButton({
  href,
  icon,
  iconBg,
  iconColor,
  title,
  sub,
  border,
}: {
  href: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  sub?: string;
  border?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border bg-white p-4 transition hover:brightness-[.98]"
      style={{ borderColor: border ?? colors.border, background: colors.white }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: iconBg }}>
        <Icon name={icon} size={22} color={iconColor} />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-extrabold" style={{ color: colors.textDark }}>
          {title}
        </span>
        {sub ? (
          <span className="block text-sm font-semibold" style={{ color: colors.textMuted }}>
            {sub}
          </span>
        ) : null}
      </span>
      <Icon name="chevron-right" size={16} color={colors.textMuted} />
    </Link>
  );
}

export function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { colors } = useAppTheme();
  return (
    <div className={`min-h-full ${className}`} style={{ background: colors.surface, color: colors.textDark }}>
      {children}
    </div>
  );
}

export function SettingsToggleRow({
  label,
  sub,
  value,
  onChange,
  last,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      style={{ borderBottom: last ? "none" : `1px solid ${colors.border}` }}
    >
      <span className="flex-1">
        <span className="block text-[15px] font-extrabold" style={{ color: colors.textDark }}>
          {label}
        </span>
        {sub ? (
          <span className="mt-0.5 block text-[11px] font-medium leading-[16px]" style={{ color: colors.textMuted }}>
            {sub}
          </span>
        ) : null}
      </span>
      <span
        className="relative h-7 w-12 shrink-0 rounded-full transition-colors"
        style={{ background: value ? colors.primary : colors.borderStrong }}
        aria-hidden
      >
        <span
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all"
          style={{ left: value ? 22 : 2 }}
        />
      </span>
    </button>
  );
}
