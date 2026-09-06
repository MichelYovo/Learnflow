import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "LearnFlow — Un chapitre n’est validé qu’à 10/10",
    template: "%s · LearnFlow",
  },
  description:
    "App mobile collège et lycée, programme APC Togo. Fiches, flashcards, règle du 10/10, quatre modes, ligues et Spira. Offline-first.",
  applicationName: "LearnFlow",
  keywords: ["LearnFlow", "Togo", "APC", "révisions", "collège", "lycée", "offline", "quiz"],
  authors: [{ name: "LearnFlow Togo" }],
  openGraph: {
    title: "LearnFlow — Un chapitre n’est validé qu’à 10/10",
    description:
      "Application élève collège-lycée APC Togo. Maîtrise, pas survol. Offline, ligues, Spira.",
    locale: "fr_TG",
    type: "website",
    siteName: "LearnFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnFlow — Un chapitre n’est validé qu’à 10/10",
    description: "App collège-lycée APC Togo. Offline-first. Règle du 10/10.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
