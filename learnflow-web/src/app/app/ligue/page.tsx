"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import LeagueBadge, { badgeSrc } from "@/components/LeagueBadge";
import { LEAGUE_TIERS } from "@/data/mock";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { LigueNom } from "@/types/learnflow";

const TIER_ORDER: LigueNom[] = ["Bronze", "Argent", "Or", "Platine", "Diamant"];
const PLACE = {
  1: { height: 132, gradient: "linear-gradient(#FDE68A,#F59E0B)", size: 64 },
  2: { height: 96, gradient: "linear-gradient(#E2E8F0,#94A3B8)", size: 52 },
  3: { height: 80, gradient: "linear-gradient(#FED7AA,#F97316)", size: 52 },
} as const;

const ACHIEVEMENTS = [
  { label: "Série 7", key: "Série 7", color: "#EF4444", icon: "flame" as const },
  { label: "Blitz King", key: "Blitz King", color: "#F59E0B", icon: "zap" as const },
  { label: "Lecteur Pro", key: "Lecteur Pro", color: "#1677FF", icon: "book" as const },
  { label: "CHALLENGER", key: "CHALLENGER", color: "#F59E0B", icon: "award" as const },
  { label: "Étoile d'Or", key: "Étoile d'Or", color: "#1677FF", icon: "star" as const },
  { label: "Diamant", key: "Diamant", color: "#06B6D4", icon: "sparkles" as const },
];

export default function LiguePage() {
  const ligue = useLearnFlowStore((s) => s.ligue);
  const leagueBoard = useLearnFlowStore((s) => s.leagueBoard);
  const gelerLigue = useLearnFlowStore((s) => s.gelerLigue);
  const badges = useLearnFlowStore((s) => s.getActiveProfile()?.badgesDebloques ?? []);
  const myAvatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const { colors, darkMode } = useAppTheme();
  const [selectedTier, setSelectedTier] = useState<LigueNom>(ligue.nomLigue);
  const [tab, setTab] = useState<"classement" | "badges">("classement");
  const [gelMsg, setGelMsg] = useState(false);

  const sorted = useMemo(
    () =>
      [...leagueBoard]
        .map((p) => (p.you && myAvatarId ? { ...p, avatarId: myAvatarId } : p))
        .sort((a, b) => a.rank - b.rank),
    [leagueBoard, myAvatarId]
  );
  const first = sorted.find((p) => p.rank === 1);
  const second = sorted.find((p) => p.rank === 2);
  const third = sorted.find((p) => p.rank === 3);
  const rest = sorted.filter((p) => p.rank >= 4 && p.rank <= 30);
  const tierMeta = LEAGUE_TIERS.find((t) => t.id === selectedTier) ?? LEAGUE_TIERS[2];
  const isCurrent = selectedTier === ligue.nomLigue;
  const currentIndex = TIER_ORDER.indexOf(ligue.nomLigue);

  return (
    <div>
      <header className="sticky top-0 z-20 border-b px-5 pb-3.5 pt-3 md:px-8" style={{ background: colors.white, borderColor: colors.border }}>
        <h1 className="text-[28px] font-extrabold tracking-tight">Ligues</h1>
        <div className="mt-3 flex gap-2">
          {(["classement", "badges"] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] px-3 text-[13px] font-extrabold"
                style={{
                  background: active ? (darkMode ? "#0C1A33" : "#E6F4FF") : colors.surfaceAlt,
                  borderColor: active ? colors.primary : "transparent",
                  color: active ? colors.primary : colors.textMuted,
                }}
              >
                <Icon name={t === "classement" ? "award" : "star"} size={16} color={active ? colors.primary : colors.textMuted} />
                {t === "classement" ? "Classement" : "Badges"}
              </button>
            );
          })}
        </div>
      </header>

      {tab === "classement" ? (
        <div className="mx-auto max-w-3xl pb-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto px-4 py-3">
            {TIER_ORDER.map((id) => {
              const meta = LEAGUE_TIERS.find((t) => t.id === id)!;
              const on = selectedTier === id;
              return (
                <button key={id} type="button" onClick={() => setSelectedTier(id)} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={badgeSrc(meta.badgeKey)} alt={meta.label} className={`object-contain ${on ? "h-12 w-12" : "h-8 w-8 opacity-50"}`} />
                </button>
              );
            })}
          </div>

          <div className="relative mx-4 mb-3 overflow-hidden rounded-[20px] p-5 text-center" style={{ background: colors.white }}>
            <div className="pointer-events-none absolute left-1/2 top-2 h-[180px] w-[180px] -translate-x-1/2 rounded-full" style={{ background: tierMeta.color, opacity: darkMode ? 0.18 : 0.12 }} />
            <LeagueBadge nom={tierMeta.id} size={132} />
            <p className="mt-2 text-[20px] font-extrabold">Ligue {tierMeta.label}</p>
            <p className="mt-1 text-[13px]" style={{ color: colors.textMuted }}>
              {isCurrent ? `Rang #${ligue.rangActuel}` : "Palier à débloquer"}
            </p>
          </div>

          {isCurrent && first && second && third ? (
            <>
              <div className="mx-4 mt-2 rounded-[20px] border p-5" style={{ background: colors.white, borderColor: colors.border }}>
                <p className="mb-4 text-center text-[11px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
                  Podium de la semaine
                </p>
                <div className="flex items-end justify-center gap-2">
                  {[{ player: second, place: 2 as const }, { player: first, place: 1 as const }, { player: third, place: 3 as const }].map(({ player, place }) => {
                    const meta = PLACE[place];
                    return (
                      <div key={place} className="flex flex-1 flex-col items-center gap-2">
                        {place === 1 ? <Icon name="award" size={22} color="#F59E0B" /> : <span className="h-[22px]" />}
                        <div className="rounded-full" style={{ border: place === 1 ? "3px solid #FBBF24" : `2px solid ${darkMode ? colors.border : "#fff"}` }}>
                          <Avatar avatarId={player.avatarId} size={meta.size} initials={player.initials} fallbackColor={player.avatarColor} />
                        </div>
                        <p className="max-w-full truncate text-[13px] font-extrabold">{player.you ? "Toi" : player.name.split(" ")[0]}</p>
                        <p className="flex items-center gap-0.5 text-[12px] font-extrabold" style={{ color: colors.primary }}>
                          <Icon name="zap" size={12} color={colors.primary} />
                          {player.xp.toLocaleString("fr-FR")}
                        </p>
                        <div className="flex w-full items-end justify-center rounded-t-2xl pb-3 text-[18px] font-black text-slate-900" style={{ height: meta.height, background: meta.gradient }}>
                          #{place}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="px-5 pb-2 pt-5 text-[18px] font-extrabold">Classement</p>
              {rest.map((player) => (
                <div
                  key={player.rank}
                  className="mx-4 mb-2 flex min-h-16 items-center gap-3 rounded-[20px] border px-4 py-3"
                  style={{
                    background: player.you ? (darkMode ? "#0C1A33" : "#E6F4FF") : colors.white,
                    borderColor: player.you ? colors.primary : colors.border,
                    borderWidth: player.you ? 1.5 : 1,
                  }}
                >
                  <span className="w-7 text-center text-[15px] font-extrabold" style={{ color: player.you ? colors.primary : colors.textMuted }}>
                    {player.rank}
                  </span>
                  <Avatar avatarId={player.avatarId} size={44} initials={player.initials} fallbackColor={player.avatarColor} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">{player.you ? `${player.name} (toi)` : player.name}</span>
                    <span className="text-xs" style={{ color: colors.textMuted }}>
                      série {player.streak} j
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-[14px] font-extrabold">
                    <Icon name="zap" size={14} color={colors.accent} />
                    {player.xp.toLocaleString("fr-FR")}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  gelerLigue(7);
                  setGelMsg(true);
                }}
                className="mx-4 mt-3 mb-2 flex min-h-[52px] w-[calc(100%-2rem)] items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] py-3.5 text-[15px] font-extrabold"
                style={{ background: colors.white, borderColor: colors.border, color: colors.primary }}
              >
                <Icon name="shield" size={20} color={colors.primary} />
                Geler ma ligue (7j)
              </button>
              {gelMsg || ligue.estGelee ? (
                <p className="px-5 text-center text-sm font-semibold" style={{ color: colors.textMuted }}>
                  Ton rang est protégé pendant 7 jours (démo).
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      ) : (
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-4 pb-8">
          <p className="text-[18px] font-extrabold">Paliers</p>
          <div className="grid grid-cols-2 gap-3">
            {LEAGUE_TIERS.map((tier, index) => {
              const unlocked = index <= currentIndex;
              return (
                <div
                  key={tier.id}
                  className="flex min-h-[140px] flex-col items-center gap-2 rounded-[20px] border p-4"
                  style={{ background: colors.white, borderColor: unlocked ? tier.color : colors.border, opacity: unlocked ? 1 : 0.4 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={badgeSrc(tier.badgeKey)} alt="" width={72} height={72} className="object-contain" />
                  <p className="text-sm font-extrabold">{tier.label}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {unlocked ? (tier.id === ligue.nomLigue ? "Palier actuel" : "Débloqué") : "Verrouillé"}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="pt-4 text-[18px] font-extrabold">Succès</p>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((b) => {
              const earned = badges.includes(b.key) || ["Série 7", "Blitz King", "Lecteur Pro"].includes(b.key);
              return (
                <div
                  key={b.label}
                  className="flex min-h-[140px] flex-col items-center gap-2 rounded-[20px] border p-4"
                  style={{ background: colors.white, borderColor: colors.border, opacity: earned ? 1 : 0.45 }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-[14px]" style={{ background: darkMode ? "#0F172A" : "#F8FAFC" }}>
                    <Icon name={b.icon} size={22} color={b.color} />
                  </span>
                  <p className="text-sm font-extrabold">{b.label}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {earned ? "Débloqué" : "Verrouillé"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
