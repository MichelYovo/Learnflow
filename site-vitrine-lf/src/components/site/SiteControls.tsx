"use client";

import { useLocale } from "../../lib/i18n";
import { useTheme } from "../../lib/theme";

type Props = {
  className?: string;
  /** Larger touch targets for the mobile drawer */
  stacked?: boolean;
};

export default function SiteControls({ className = "", stacked = false }: Props) {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const themeLabel = theme === "light" ? t.a11y.switchToDark : t.a11y.switchToLight;

  return (
    <div
      className={`flex items-center gap-1.5 ${stacked ? "w-full justify-between rounded-2xl border border-white/15 bg-white/5 p-2" : ""} ${className}`.trim()}
      role="group"
      aria-label="Langue et thème"
    >
      <div className={`flex items-center gap-1 ${stacked ? "flex-1" : ""}`}>
        <button
          type="button"
          onClick={() => setLocale("fr")}
          className={`lf-ctrl ${locale === "fr" ? "lf-ctrl-active" : ""} ${stacked ? "lf-ctrl-lg flex-1" : ""}`}
          aria-label={t.a11y.switchToFr}
          aria-pressed={locale === "fr"}
          title={t.a11y.switchToFr}
        >
          FR
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={`lf-ctrl ${locale === "en" ? "lf-ctrl-active" : ""} ${stacked ? "lf-ctrl-lg flex-1" : ""}`}
          aria-label={t.a11y.switchToEn}
          aria-pressed={locale === "en"}
          title={t.a11y.switchToEn}
        >
          EN
        </button>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className={`lf-ctrl lf-ctrl-icon ${stacked ? "lf-ctrl-lg" : ""}`}
        aria-label={themeLabel}
        title={themeLabel}
      >
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
            <path
              d="M21 14.3A8.2 8.2 0 0 1 9.7 3 7 7 0 1 0 21 14.3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
