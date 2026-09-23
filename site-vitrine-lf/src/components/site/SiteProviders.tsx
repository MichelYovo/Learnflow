"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "../../lib/i18n";
import { ThemeProvider } from "../../lib/theme";
import SupportProvider from "./SupportProvider";

export default function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <SupportProvider>{children}</SupportProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
