"use client";

import Link from "next/link";
import { useAppTheme } from "@/theme/useAppTheme";
import Icon, { type IconName } from "./Icon";

/** Même largeur / padding pour header et contenu — colonne centrée. */
export const APP_MAX = "max-w-3xl";
export const APP_PAD = "px-3 min-[380px]:px-4 sm:px-6 lg:px-8";
export const APP_COL = `mx-auto w-full ${APP_MAX} ${APP_PAD}`;
export const APP_NARROW = `mx-auto w-full max-w-xl ${APP_PAD}`;
export const AUTH_COL =
  "mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col px-4 py-4 min-[380px]:px-5 sm:max-w-lg sm:px-8 sm:py-6";

export function AuthStage({
  children,
  top,
  footer,
}: {
  children: React.ReactNode;
  top?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className={AUTH_COL}>
      {top ? <div className="shrink-0">{top}</div> : null}
      <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto py-4 sm:py-6 ${footer ? "" : "justify-center"}`}>{children}</div>
      {footer ? <div className="shrink-0 pt-3 sm:pt-4">{footer}</div> : null}
    </div>
  );
}

export function AppBar({
  children,
  bordered = true,
  stack = false,
  className = "",
  innerClassName = "",
}: {
  children: React.ReactNode;
  bordered?: boolean;
  stack?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <header
      className={`sticky top-0 z-20 ${bordered ? "border-b" : ""} ${className}`}
      style={{
        background: colors.white,
        borderColor: colors.border,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div
        className={`mx-auto flex w-full ${APP_MAX} ${APP_PAD} py-3 ${stack ? "flex-col items-stretch" : "items-center"} ${innerClassName}`}
      >
        {children}
      </div>
    </header>
  );
}

export function AppMain({
  children,
  narrow,
  fill,
  className = "",
}: {
  children: React.ReactNode;
  narrow?: boolean;
  fill?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${narrow ? APP_NARROW : APP_COL} ${fill ? "pt-5 pb-8" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

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
    <AppBar innerClassName="gap-3">
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: colors.surfaceAlt }}
          aria-label="Retour"
        >
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Link>
      ) : null}
      <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold md:text-xl">{title}</h1>
      {right ? <div className="shrink-0">{right}</div> : null}
    </AppBar>
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
      className="flex items-center gap-3 rounded-2xl border bg-white p-4 [@media(hover:hover)]:hover:brightness-[.98]"
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
    <div
      className={`flex h-dvh min-h-dvh flex-col ${className}`}
      style={{
        background: colors.surface,
        color: colors.textDark,
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
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
