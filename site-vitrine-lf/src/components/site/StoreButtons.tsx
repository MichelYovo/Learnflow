"use client";

import { APP_STORE_URL, PLAY_URL } from "../../lib/brand";
import SupportButton from "./SupportButton";

type Props = { compact?: boolean; align?: "start" | "center"; light?: boolean };

export default function StoreButtons({ compact = false, align = "start", light = false }: Props) {
  const play = PLAY_URL.trim();
  const ios = APP_STORE_URL.trim();
  const bothMissing = !play && !ios;
  const dark = light
    ? "bg-white text-[#1C1917] hover:bg-[#F6F3EE]"
    : "bg-[#1C1917] text-white hover:bg-black";
  const btn =
    "inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl px-4 py-2.5 text-left sm:min-h-0 sm:w-auto";

  return (
    <div
      className={`flex min-w-0 ${
        compact ? "flex-row flex-wrap gap-2" : "w-full flex-col gap-3 sm:flex-row sm:flex-wrap"
      } ${align === "center" ? "items-center justify-center" : ""}`}
    >
      {play ? (
        <a href={play} className={`${btn} ${dark}`}>
          <PlayIcon />
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold opacity-70">Disponible sur</span>
            <span className="block text-sm font-extrabold">{compact ? "Google Play" : "Google Play"}</span>
          </span>
        </a>
      ) : (
        <span className={`${btn} ${dark} opacity-80`}>
          <PlayIcon />
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold opacity-70">Bientôt sur</span>
            <span className="block text-sm font-extrabold">Google Play</span>
          </span>
        </span>
      )}
      {ios ? (
        <a href={ios} className={`${btn} ${dark}`}>
          <AppleIcon />
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold opacity-70">Télécharger dans</span>
            <span className="block text-sm font-extrabold">l’App Store</span>
          </span>
        </a>
      ) : (
        <span className={`${btn} ${dark} opacity-80`}>
          <AppleIcon />
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold opacity-70">Bientôt sur</span>
            <span className="block text-sm font-extrabold">l’App Store</span>
          </span>
        </span>
      )}
      {bothMissing && !compact ? (
        <SupportButton
          topic="waitlist"
          className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold underline-offset-4 hover:underline ${
            light ? "text-white/80 hover:text-white" : "text-[#5F5A55] hover:text-[#1C1917]"
          }`}
        >
          Préviens-moi
        </SupportButton>
      ) : null}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        d="M1.2 1.7c-.2.3-.2.8-.2 1.5v17.6c0 .7 0 1.2.2 1.5.2.4.5.6.9.7l10.8-10.7L2.1 1c-.4.1-.7.3-.9.7Zm12.2 12-2.4 2.4 5.6 3.2c.8.5 1.2.2 1.5-.3.2-.3.2-.7.2-1.5v-.3l-4.9-3.5Zm4.9-8.7v-.3c0-.8 0-1.2-.2-1.5-.3-.5-.7-.8-1.5-.3l-5.6 3.2 2.4 2.4 4.9-3.5ZM9.7 12 3.4 5.7l6.8 3.9L13.4 12l-3.2 2.4-6.8 3.9L9.7 12Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        d="M14.7 11.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.7-3.9Zm-2.5-7.3c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.9-1 3 1 .1 2-.5 2.7-1.4Z"
      />
    </svg>
  );
}
