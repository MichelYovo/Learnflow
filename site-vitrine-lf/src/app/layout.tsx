import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import SupportProvider from "../components/site/SupportProvider";
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
    default: "LearnFlow — Tes cours, compris pour de vrai",
    template: "%s · LearnFlow",
  },
  description:
    "L’app de révision pour collégiens et lycéens du Togo. Cours, quiz, règle du 10/10, quatre modes et Spira.",
  applicationName: "LearnFlow",
  keywords: ["LearnFlow", "Togo", "APC", "révisions", "collège", "lycée", "quiz", "ligues"],
  authors: [{ name: "LearnFlow Togo" }],
  openGraph: {
    title: "LearnFlow — Tes cours, compris pour de vrai",
    description: "Révisions collège et lycée au Togo. Un chapitre n’est validé qu’à 10/10.",
    locale: "fr_TG",
    type: "website",
    siteName: "LearnFlow",
    images: [
      {
        url: "/brand/logo-lockup-light.png",
        width: 1536,
        height: 1024,
        alt: "LearnFlow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnFlow — Tes cours, compris pour de vrai",
    description: "App collège-lycée au Togo. Un chapitre validé seulement à 10/10.",
    images: ["/brand/logo-lockup-light.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/logo-mark.png", type: "image/png" },
    ],
    apple: "/brand/logo-mark.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B1B3A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-dvh w-full max-w-[100vw] flex-col overflow-x-hidden font-sans">
        <SupportProvider>{children}</SupportProvider>
      </body>
    </html>
  );
}
