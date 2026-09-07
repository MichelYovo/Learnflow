"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import { LeagueBadgeCircle } from "@/components/LeagueBadge";
import { AppBar } from "@/components/ui";
import { LEAGUE_TIERS } from "@/data/mock";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { LigueNom } from "@/types/learnflow";

const TIER_ORDER: LigueNom[] = ["Bronze", "Argent", "Or", "Platine", "Diamant"];
const PLACE = {
  1: {
    height: 108,
    size: 64,
    ring: "#F59E0B",
    glow: "rgba(245,158,11,0.38)",
    bar: "linear-gradient(180deg,#FDE68A 0%,#F59E0B 52%,#D97706 100%)",
    lip: "#FEF3C7",
    ink: "#78350F",
  },
  2: {
    height: 78,
    size: 52,
    ring: "#94A3B8",
    glow: "rgba(148,163,184,0.32)",
    bar: "linear-gradient(180deg,#F8FAFC 0%,#CBD5E1 48%,#94A3B8 100%)",
    lip: "#FFFFFF",
    ink: "#334155",
  },
  3: {
    height: 62,
    size: 52,
    ring: "#F97316",
    glow: "rgba(249,115,22,0.32)",
    bar: "linear-gradient(180deg,#FED7AA 0%,#FB923C 50%,#EA580C 100%)",
    lip: "#FFEDD5",
    ink: "#9A3412",
  },
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
  const tierMeta = LEAGUE_TIERS.find((t) => t.id === selectedTier) ?? LEAGUE_TIERS[0];
  const isCurrent = selectedTier === ligue.nomLigue;
  const currentIndex = TIER_ORDER.indexOf(ligue.nomLigue);
  const selectedIndex = TIER_ORDER.indexOf(selectedTier);
  const isUnlocked = selectedIndex <= currentIndex;

  return (
    <div>
      <AppBar stack innerClassName="pb-3.5 pt-3">
        <h1 className="text-[22px] font-extrabold tracking-tight sm:text-[28px]">Ligues</h1>
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
      </AppBar>

      {tab === "classement" ? (
        <div className="mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-3 sm:gap-3">
            {TIER_ORDER.map((id, index) => {
              const on = selectedTier === id;
              const locked = index > currentIndex;
              return (
                <button key={id} type="button" onClick={() => setSelectedTier(id)} className="shrink-0">
                  <LeagueBadgeCircle nom={id} size={on ? 40 : 28} selected={on} dimmed={locked && !on} />
                </button>
              );
            })}
          </div>

          <div className="relative mb-3 overflow-hidden rounded-[20px] px-5 pb-5 pt-6 text-center" style={{ background: colors.white }}>
            <div className="relative mx-auto inline-flex pb-3">
              <LeagueBadgeCircle nom={tierMeta.id} size={108} selected dimmed={!isUnlocked} />
              {isCurrent ? (
                <span
                  className="absolute bottom-1 left-1/2 z-[2] -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[12px] font-black text-white"
                  style={{ background: tierMeta.color, boxShadow: `0 0 0 3px ${colors.white}` }}
                >
                  #{ligue.rangActuel}
                </span>
              ) : null}
            </div>
            <p className="text-[18px] font-extrabold sm:text-[20px]">Ligue {tierMeta.label}</p>
            <p className="mt-1 text-[13px] font-semibold" style={{ color: isCurrent ? tierMeta.color : colors.textMuted }}>
              {isCurrent ? `Rang #${ligue.rangActuel} · cette semaine` : isUnlocked ? "Palier débloqué" : "Palier à débloquer"}
            </p>
          </div>

          {!isCurrent ? (
            <p className="mb-2 text-center text-sm font-semibold" style={{ color: colors.textMuted }}>
              {isUnlocked
                ? "Tu as déjà dépassé ce palier. Le classement s’affiche pour ta ligue actuelle."
                : "Gagne de l’XP cette semaine pour viser ce palier."}
            </p>
          ) : null}

          {isCurrent && sorted.length > 0 ? (
            <>
              {first && second && third ? (
            <>
              <div className="mt-2 overflow-hidden rounded-[20px] border pt-5" style={{ background: colors.white, borderColor: colors.border }}>
                <p className="mb-4 text-center text-[11px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
                  Podium de la semaine
                </p>
                <div className="flex items-end justify-center gap-1 px-2 sm:gap-2 sm:px-4">
                  {[{ player: second, place: 2 as const }, { player: first, place: 1 as const }, { player: third, place: 3 as const }].map(({ player, place }) => {
                    const meta = PLACE[place];
                    return (
                      <div
                        key={place}
                        className={`flex min-w-0 flex-col items-center pt-4 ${place === 1 ? "z-[1] flex-[1.2]" : "flex-1"}`}
                      >
                        <div className="relative z-[1] mb-2.5 flex flex-col items-center">
                          {place === 1 ? (
                            <span
                              className="absolute -top-3 left-1/2 z-[2] flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full"
                              style={{ background: "#FEF3C7", boxShadow: "0 2px 8px rgba(245,158,11,0.45)" }}
                            >
                              <Icon name="crown" size={16} color="#D97706" />
                            </span>
                          ) : null}
                          <div
                            className="rounded-full"
                            style={{
                              padding: place === 1 ? 3 : 2,
                              background: meta.ring,
                              boxShadow: `0 10px 22px ${meta.glow}`,
                            }}
                          >
                            <Avatar
                              avatarId={player.avatarId}
                              size={meta.size}
                              initials={player.initials}
                              fallbackColor={player.avatarColor}
                            />
                          </div>
                          <span
                            className="absolute -bottom-1 left-1/2 z-[2] flex h-6 min-w-6 -translate-x-1/2 items-center justify-center rounded-full px-1.5 text-[11px] font-black text-white"
                            style={{ background: meta.ring, boxShadow: `0 0 0 2px ${colors.white}` }}
                          >
                            {place}
                          </span>
                        </div>
                        <p
                          className="max-w-full truncate px-1 text-[13px] font-extrabold"
                          style={{ color: player.you ? colors.primary : colors.textDark }}
                        >
                          {player.you ? "Toi" : player.name.split(" ")[0]}
                        </p>
                        <p className="mb-2 flex items-center gap-0.5 text-[11px] font-extrabold" style={{ color: meta.ink }}>
                          <Icon name="zap" size={11} color={meta.ring} />
                          {player.xp.toLocaleString("fr-FR")}
                        </p>
                        <div
                          className="relative w-full rounded-t-[18px]"
                          style={{
                            height: meta.height,
                            background: meta.bar,
                            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5)",
                          }}
                        >
                          <span
                            className="absolute left-1/2 top-1.5 h-1.5 w-[42%] -translate-x-1/2 rounded-full"
                            style={{ background: meta.lip, opacity: 0.85 }}
                          />
                          <span
                            className="absolute inset-x-0 bottom-3 text-center text-[22px] font-black tracking-tight"
                            style={{ color: meta.ink }}
                          >
                            #{place}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </>
              ) : null}

              <p className="pb-2 pt-5 text-[18px] font-extrabold">Classement</p>
              {(first && second && third ? rest : sorted).map((player) => (
                <div
                  key={`${player.studentId ?? player.name}-${player.rank}`}
                  className="mb-2 flex min-h-16 items-center gap-3 rounded-[20px] border px-4 py-3"
                  style={{
                    background: player.you ? (darkMode ? "#0C1A33" : "#E6F4FF") : colors.white,
                    borderColor: player.you ? colors.primary : colors.border,
                    borderWidth: player.you ? 1.5 : 1,
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold"
                    style={{
                      background: player.you ? colors.primary : colors.surfaceAlt,
                      color: player.you ? "#fff" : colors.textMuted,
                    }}
                  >
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
                className="mt-3 mb-2 flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] py-3.5 text-[15px] font-extrabold"
                style={{ background: colors.white, borderColor: colors.border, color: colors.primary }}
              >
                <Icon name="shield" size={20} color={colors.primary} />
                Geler ma ligue (7j)
              </button>
              {gelMsg || ligue.estGelee ? (
                <p className="text-center text-sm font-semibold" style={{ color: colors.textMuted }}>
                  Ton rang est protégé pendant 7 jours (démo).
                </p>
              ) : null}
            </>
          ) : isCurrent ? (
            <p className="mb-2 text-center text-sm font-semibold" style={{ color: colors.textMuted }}>
              Le classement est vide pour l’instant. Dès qu’un élève se connecte, il apparaît ici — dernier tant qu’il n’a pas encore d’XP.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-4 pb-8 sm:px-6 lg:px-8">
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
                  <LeagueBadgeCircle nom={tier.id} size={72} selected={tier.id === ligue.nomLigue} />
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
