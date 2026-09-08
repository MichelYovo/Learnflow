"use client";

import { APP_STORE_URL, PLAY_URL } from "../../lib/brand";
import SupportButton from "./SupportButton";

type Props = { compact?: boolean; align?: "start" | "center" };

export default function StoreButtons({ compact = false, align = "start" }: Props) {
  const play = PLAY_URL.trim();
  const ios = APP_STORE_URL.trim();
  const bothMissing = !play && !ios;

  return (
    <div className={`flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
      {play ? (
        <a
          href={play}
          className="inline-flex items-center justify-center rounded-2xl bg-[#1677FF] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(22,119,255,.28)] transition hover:bg-[#155EEF]"
        >
          {compact ? "Android" : "Télécharger sur Android"}
        </a>
      ) : (
        <span className="inline-flex items-center justify-center rounded-2xl bg-[#1677FF] px-5 py-3 text-sm font-extrabold text-white opacity-80">
          {compact ? "Android bientôt" : "Bientôt sur Android"}
        </span>
      )}
      {ios ? (
        <a
          href={ios}
          className="inline-flex items-center justify-center rounded-2xl border-2 border-[#BAE0FF] bg-white px-5 py-3 text-sm font-extrabold text-[#1677FF] transition hover:bg-[#E6F4FF]"
        >
          {compact ? "iPhone" : "Télécharger sur iPhone"}
        </a>
      ) : (
        <span className="inline-flex items-center justify-center rounded-2xl border-2 border-[#BAE0FF] bg-white px-5 py-3 text-sm font-extrabold text-[#1677FF] opacity-80">
          {compact ? "iPhone bientôt" : "Bientôt sur iPhone"}
        </span>
      )}
      {bothMissing && !compact ? (
        <SupportButton
          topic="waitlist"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold text-[#64748B] underline-offset-4 hover:text-[#1677FF] hover:underline"
        >
          Préviens-moi
        </SupportButton>
      ) : null}
    </div>
  );
}
