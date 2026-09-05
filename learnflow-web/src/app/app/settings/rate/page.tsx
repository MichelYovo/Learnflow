"use client";

import { useState } from "react";
import Spira from "@/components/Spira";
import { ScreenHeader, PrimaryButton } from "@/components/ui";
import { spiraForRatingStars } from "@/data/spira";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function RatePage() {
  const { colors } = useAppTheme();
  const setAppRating = useLearnFlowStore((s) => s.setAppRating);
  const current = useLearnFlowStore((s) => s.settings.appRating);
  const [stars, setStars] = useState(current?.stars ?? 0);
  const [comment, setComment] = useState(current?.comment ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <ScreenHeader title="Évaluer l'app" backHref="/app/profil" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-6 text-center md:px-8">
        <Spira mood={spiraForRatingStars(stars)} size={96} scene="settings.rate" message="" />
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setStars(n)} className="text-3xl" style={{ color: n <= stars ? "#F59E0B" : colors.borderStrong }}>
              ★
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Un mot pour l'équipe…"
          className="w-full rounded-2xl border p-3 text-sm font-medium outline-none"
          style={{ borderColor: colors.border, background: colors.white, color: colors.textDark }}
        />
        {saved ? <p className="text-sm font-bold" style={{ color: colors.secondary }}>Merci !</p> : null}
        <PrimaryButton
          onClick={() => {
            if (!stars) return;
            setAppRating({ stars, comment, at: new Date().toISOString() });
            setSaved(true);
          }}
        >
          Envoyer
        </PrimaryButton>
      </div>
    </div>
  );
}
