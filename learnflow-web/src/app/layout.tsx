import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import AuthGuard from "@/components/AuthGuard";
import CloudSyncBootstrap from "@/components/CloudSyncBootstrap";
import SfxBootstrap from "@/components/SfxBootstrap";
import { ThemeSync } from "@/components/useHydrated";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002"),
  title: {
    default: "LearnFlow — Un chapitre n’est validé qu’à 10/10",
    template: "%s · LearnFlow",
  },
  description:
    "Version web élève LearnFlow. Programme APC Togo, fiches, flashcards, quiz 10/10, quatre modes, ligues et Spira.",
  applicationName: "LearnFlow",
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1677FF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${poppins.variable} h-dvh antialiased`}>
      <body className="h-dvh min-h-dvh font-sans">
        <ThemeSync />
        <SfxBootstrap />
        <CloudSyncBootstrap />
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
