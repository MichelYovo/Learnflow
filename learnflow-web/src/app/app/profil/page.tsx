"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import AvatarPicker from "@/components/AvatarPicker";
import Icon, { type IconName } from "@/components/Icon";
import LeagueBadge from "@/components/LeagueBadge";
import { AppBar, AppMain } from "@/components/ui";
import { classLabel } from "@/data/mock";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

const SETTINGS: { key: string; href?: string; action?: "logout"; icon: IconName; label: string; danger?: boolean }[] = [
  { key: "focus", href: "/focus", icon: "moon", label: "Mode concentration" },
  { key: "notifications", href: "/app/settings/notifications", icon: "bell", label: "Notifications" },
  { key: "privacy", href: "/app/settings/privacy", icon: "shield", label: "Confidentialité" },
  { key: "rate", href: "/app/settings/rate", icon: "star", label: "Évaluer l'app" },
  { key: "about", href: "/app/settings/about", icon: "compass", label: "À propos" },
  { key: "logout", action: "logout", icon: "log-out", label: "Déconnexion", danger: true },
];

const TROPHIES = [
  { icon: "flame" as const, color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", label: "Série 7" },
  { icon: "zap" as const, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", label: "Blitz" },
  { icon: "book" as const, color: "#1677FF", bg: "#E6F4FF", border: "#BAE0FF", label: "Lecteur" },
];

const STATS_META = [
  { label: "XP Total", key: "xp" as const, icon: "zap" as const, color: "#F59E0B", bg: "#FFFBEB" },
  { label: "Série", key: "streak" as const, icon: "flame" as const, color: "#EF4444", bg: "#FEF2F2" },
  { label: "Rang", key: "rang" as const, icon: "award" as const, color: "#1677FF", bg: "#E6F4FF" },
  { label: "Leçons", key: "lessons" as const, icon: "book" as const, color: "#10B981", bg: "#ECFDF5" },
];

export default function ProfilPage() {
  const { colors, darkMode } = useAppTheme();
  const router = useRouter();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const ligue = useLearnFlowStore((s) => s.ligue);
  const setDarkMode = useLearnFlowStore((s) => s.setDarkMode);
  const multiProfileEnabled = useLearnFlowStore((s) => s.settings.multiProfileEnabled);
  const setMultiProfileEnabled = useLearnFlowStore((s) => s.setMultiProfileEnabled);
  const enableMultiProfile = useLearnFlowStore((s) => s.enableMultiProfile);
  const updateProfileName = useLearnFlowStore((s) => s.updateProfileName);
  const updateProfileAvatar = useLearnFlowStore((s) => s.updateProfileAvatar);
  const logout = useLearnFlowStore((s) => s.logout);
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draftName, setDraftName] = useState(profile.nom);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pinDraft, setPinDraft] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinError, setPinError] = useState("");
  const [confirm, setConfirm] = useState<"logout" | null>(null);

  const grade = profile.gradeLabel ?? classLabel(profile.classe);
  const nextLigue =
    ligue.nomLigue === "Bronze"
      ? "Argent"
      : ligue.nomLigue === "Argent"
        ? "Or"
        : ligue.nomLigue === "Or"
          ? "Platine"
          : ligue.nomLigue === "Platine"
            ? "Diamant"
            : null;
  const stats = {
    xp: profile.xpTotale.toLocaleString("fr-FR"),
    streak: `${profile.streak}j`,
    rang: `#${profile.rang}`,
    lessons: String(profile.lessonsDone),
  };

  const saveName = () => {
    if (draftName.trim().length < 2) return;
    updateProfileName(draftName.trim());
    setEditing(false);
  };

  const savePin = () => {
    if (!/^\d{4}$/.test(pinDraft)) {
      setPinError("Choisis un code PIN à 4 chiffres.");
      return;
    }
    if (pinDraft !== pinConfirm) {
      setPinError("Les codes PIN ne correspondent pas.");
      return;
    }
    enableMultiProfile(pinDraft);
    setShowPinSetup(false);
    setPinDraft("");
    setPinConfirm("");
    setPinError("");
  };

  return (
    <div>
      <AppBar innerClassName="justify-between py-3.5">
        <h1 className="truncate text-xl font-extrabold sm:text-[22px]">Mon profil</h1>
        <button
          type="button"
          onClick={() => (editing ? saveName() : (setDraftName(profile.nom), setEditing(true)))}
          className="flex shrink-0 items-center gap-1.5 rounded-[14px] px-2.5 py-2 text-sm font-bold sm:px-3.5 sm:py-2.5"
          style={{ background: colors.surfaceAlt }}
        >
          <Icon name={editing ? "check" : "settings"} size={13} color={colors.textDark} />
          {editing ? "Enregistrer" : "Modifier"}
        </button>
      </AppBar>

      <AppMain className="pb-10">
        <div className="flex flex-col items-center pb-6 pt-7">
          <button type="button" onClick={() => setPickerOpen(true)} className="relative mb-3">
            <Avatar avatarId={profile.avatarId} size={96} initials={profile.firstName} fallbackColor={profile.color} />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2" style={{ background: colors.primary, borderColor: colors.white }}>
              <Icon name="pen" size={11} color="#fff" />
            </span>
          </button>
          {editing ? (
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="w-full max-w-[min(280px,calc(100vw-2rem))] rounded-[14px] border-2 px-3.5 py-2 text-center text-lg font-extrabold outline-none"
              style={{ borderColor: colors.mathsBorder, background: colors.white, color: colors.textDark }}
            />
          ) : (
            <p className="max-w-full px-2 text-center text-[20px] font-extrabold sm:text-[20px]">{profile.nom}</p>
          )}
          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border-2 border-[#BAE0FF] bg-[#E6F4FF] px-3 py-1 text-[13px] font-extrabold text-[#1677FF]">{grade}</span>
            <span className="rounded-full border-2 border-[#FDE68A] bg-[#FFFBEB] px-3 py-1 text-[13px] font-extrabold text-[#F59E0B]">Ligue {ligue.nomLigue}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STATS_META.map((s) => (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-1 rounded-[18px] border py-3.5" style={{ background: colors.white, borderColor: colors.border }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px]" style={{ background: s.bg }}>
                <Icon name={s.icon} size={14} color={s.color} />
              </span>
              <p className="text-[15px] font-extrabold">{stats[s.key]}</p>
              <p className="text-[12px] font-semibold" style={{ color: colors.textMuted }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-6 text-[18px] font-extrabold">Ma ligue</h2>
        <button
          type="button"
          onClick={() => router.push("/app/ligue")}
          className="mt-3 flex w-full items-center gap-3 rounded-3xl border p-4"
          style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
        >
          <LeagueBadge nom={ligue.nomLigue} size={64} />
          <span className="min-w-0 flex-1 text-left">
            <span className="mb-0.5 flex flex-wrap items-center gap-2">
              <span className="text-[16px] font-extrabold text-[#78350F]">Ligue {ligue.nomLigue}</span>
              <span className="rounded-full bg-[#F59E0B] px-2 py-0.5 text-[12px] font-extrabold text-white">Groupe {ligue.groupe}</span>
            </span>
            <span className="mb-2 block text-sm font-semibold text-[#92400E]">#{profile.rang}</span>
            <span className="flex items-center gap-2">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#FDE68A]">
                <span className="block h-full rounded-full bg-[#F59E0B]" style={{ width: `${Math.min(100, ligue.scoreHebdo)}%` }} />
              </span>
              <span className="text-[13px] font-extrabold text-[#F59E0B]">{nextLigue ?? ligue.nomLigue}</span>
            </span>
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FEF3C7]">
            <Icon name="chevron-right" size={14} color="#F59E0B" />
          </span>
        </button>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold">Trophées débloqués</h2>
          <button type="button" onClick={() => router.push("/app/ligue")} className="flex items-center gap-0.5 text-[15px] font-bold" style={{ color: colors.primary }}>
            Voir tout
            <Icon name="chevron-right" size={10} color={colors.primary} />
          </button>
        </div>
        <div className="mt-2.5 flex min-w-0 gap-2">
          {TROPHIES.map((t) => {
            const unlocked = profile.badgesDebloques.some((b) => b.toLowerCase().includes(t.label.toLowerCase().split(" ")[0]));
            return (
              <div
                key={t.label}
                className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl border py-3.5"
                style={{
                  background: unlocked ? t.bg : colors.surfaceAlt,
                  borderColor: unlocked ? t.border : colors.borderStrong,
                  opacity: unlocked ? 1 : 0.45,
                }}
              >
                <Icon name={unlocked ? t.icon : "lock"} size={18} color={unlocked ? t.color : colors.textMuted} />
                <span className="px-1 text-center text-[11px] font-extrabold leading-tight sm:text-[13px]" style={{ color: unlocked ? t.color : colors.textMuted }}>
                  {t.label}
                </span>
              </div>
            );
          })}
          <div className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl border py-3.5 opacity-45" style={{ background: colors.surfaceAlt, borderColor: colors.borderStrong }}>
            <Icon name="lock" size={18} color={colors.textMuted} />
            <span className="text-[13px] font-extrabold" style={{ color: colors.textMuted }}>
              +3
            </span>
          </div>
        </div>

        <h2 className="mt-6 text-[18px] font-extrabold">Apparence</h2>
        <div className="mt-3 overflow-hidden rounded-3xl border" style={{ background: colors.white, borderColor: colors.border }}>
          <label className="flex items-center gap-3 px-3.5 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: darkMode ? "#0C1A33" : colors.mathsBg }}>
              <Icon name={darkMode ? "moon" : "sun"} size={16} color={colors.primary} />
            </span>
              <span className="min-w-0 flex-1 text-[16px] font-extrabold">Mode sombre</span>
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
          </label>
          <div className="mx-3.5 border-t" style={{ borderColor: colors.border }} />
          <label className="flex items-center gap-3 px-3.5 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: colors.mathsBg }}>
              <Icon name="people" size={16} color={colors.primary} />
            </span>
            <span className="min-w-0 flex-1 text-[16px] font-extrabold">Multi-profil</span>
            <input
              type="checkbox"
              checked={multiProfileEnabled || showPinSetup}
              onChange={(e) => {
                if (!e.target.checked) {
                  setShowPinSetup(false);
                  setMultiProfileEnabled(false);
                  return;
                }
                if (profile.hasPin) setMultiProfileEnabled(true);
                else setShowPinSetup(true);
              }}
            />
          </label>
          {showPinSetup ? (
            <div className="space-y-2 px-3.5 pb-3.5">
              <p className="text-xs font-medium" style={{ color: colors.textMuted }}>
                Choisis un PIN à 4 chiffres pour protéger ce profil.
              </p>
              <input value={pinDraft} onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="PIN" maxLength={4} className="w-full rounded-[14px] border-2 px-3.5 py-3 text-center text-base font-bold tracking-[0.4em] outline-none" style={{ borderColor: colors.border, background: colors.surfaceAlt, color: colors.textDark }} />
              <input value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Confirmer" maxLength={4} className="w-full rounded-[14px] border-2 px-3.5 py-3 text-center text-base font-bold tracking-[0.4em] outline-none" style={{ borderColor: colors.border, background: colors.surfaceAlt, color: colors.textDark }} />
              {pinError ? <p className="text-xs font-bold text-red-500">{pinError}</p> : null}
              <button type="button" onClick={savePin} className="w-full rounded-[14px] py-3 text-sm font-extrabold text-white" style={{ background: colors.primary }}>
                Enregistrer le PIN
              </button>
            </div>
          ) : null}
        </div>

        <h2 className="mt-6 text-[18px] font-extrabold">Paramètres</h2>
        <div className="mt-3 overflow-hidden rounded-3xl border" style={{ background: colors.white, borderColor: colors.border }}>
          {SETTINGS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                if (s.action === "logout") {
                  setConfirm("logout");
                  return;
                }
                if (s.href) router.push(s.href);
              }}
              className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left"
              style={{ borderTop: i ? `1px solid ${colors.border}` : undefined }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: s.danger ? (darkMode ? "#2A1010" : "#FEF2F2") : colors.surfaceAlt }}>
                <Icon name={s.icon} size={16} color={s.danger ? colors.danger : colors.textDark} />
              </span>
              <span className="flex-1 text-[16px] font-extrabold" style={{ color: s.danger ? colors.danger : colors.textDark }}>
                {s.label}
              </span>
              {!s.danger ? <Icon name="chevron-right" size={14} color="#C4C2BF" /> : null}
            </button>
          ))}
        </div>
      </AppMain>

      <AvatarPicker
        open={pickerOpen}
        selectedId={profile.avatarId}
        onSelect={updateProfileAvatar}
        onClose={() => setPickerOpen(false)}
      />

      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-sm rounded-3xl p-5" style={{ background: colors.white }}>
            <p className="text-lg font-extrabold">Déconnexion</p>
            <p className="mt-2 text-sm font-semibold" style={{ color: colors.textSecondary }}>
              Revenir à l&apos;écran de connexion ?
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="flex-1 rounded-2xl py-3 text-sm font-extrabold" style={{ background: colors.surfaceAlt }}>
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/splash");
                }}
                className="flex-1 rounded-2xl py-3 text-sm font-extrabold text-white"
                style={{ background: colors.danger }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
