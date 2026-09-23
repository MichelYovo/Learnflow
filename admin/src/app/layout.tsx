import type { Metadata } from "next";
import "./globals.css";

/**
 * Pas de next/font/google ici : le fetch Google au build échoue hors ligne
 * (et peut faire planter Vercel/Turbopack). Poppins est chargé en CSS runtime.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
  title: {
    default: "LearnFlow Admin",
    template: "%s · LearnFlow Admin",
  },
  description: "Espace administrateur unique LearnFlow — suivi des élèves, ligues et programme APC Togo.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full min-h-dvh max-w-[100vw] overflow-x-clip bg-[#FAFAF9] font-sans">{children}</body>
    </html>
  );
}
