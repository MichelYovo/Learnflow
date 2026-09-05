import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthGuard from "@/components/AuthGuard";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <ThemeSync />
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
