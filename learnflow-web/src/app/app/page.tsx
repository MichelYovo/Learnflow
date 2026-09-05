"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import LeagueBadge from "@/components/LeagueBadge";
import MesMatieres from "@/components/MesMatieres";
import ModeWorkSelector from "@/components/ModeWorkSelector";
import { WEEK_BARS } from "@/data/mock";
import { continueLessonForClass, programmeForClass, subjectShortcutsForClass } from "@/data/programme";
import { cardsDueToday } from "@/engine/spacedRepetition";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { MODE_DEFAULT_TOOLS, appModeToSessionMode, type AppMode } from "@/types/modes";
import { AGENDA_MODE_CONFIG } from "@/data/mock";

const WEEK_CHART = [
  { label: "L", height: 34, color: "#BFDBFE" },
  { label: "M", height: 64, color: "#3B82F6" },
  { label: "M", height: 46, color: "#BFDBFE" },
  { label: "J", height: 84, color: "#2563EB" },
  { label: "V", height: 76, color: "#3B82F6" },
  { label: "S", height: 38, color: "#BFDBFE" },
  { label: "D", height: 16, color: "#1D4ED8", today: true },
];

export default function AccueilPage() {
  const router = useRouter();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const ligue = useLearnFlowStore((s) => s.ligue);
  const setPendingMode = useLearnFlowStore((s) => s.setPendingMode);
  const setCustomTools = useLearnFlowStore((s) => s.setCustomTools);
  const agendaSessions = useLearnFlowStore((s) => s.agendaSessions);
  const flashcards = useLearnFlowStore((s) => s.flashcards);
  const inbox = useLearnFlowStore((s) => s.inbox);
  const { colors, darkMode } = useAppTheme();
  const weekXp = WEEK_BARS.reduce((a, b) => a + b.xp, 0);
  const continueLesson = continueLessonForClass(profile.classe);
  const shortcuts = subjectShortcutsForClass(profile.classe);
  const [selectedMode, setSelectedMode] = useState<AppMode | null>(null);
  const dueCount = cardsDueToday(flashcards).length;
  const unread = inbox.filter((n) => !n.read).length;
  const todayIdx = (new Date().getDay() + 6) % 7;
  const todaySessions = agendaSessions
    .filter((s) => s.day === todayIdx)
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  const totalDone = programmeForClass(profile.classe).reduce(
    (a, s) => a + s.themes.reduce((b, t) => b + t.lessonsDone, 0),
    0
  );
  const greetingName = (profile.firstName || profile.nom || "").trim() || "toi";
  const nextLigue = useMemo(() => {
    if (ligue.nomLigue === "Bronze") return "Argent";
    if (ligue.nomLigue === "Argent") return "Or";
    if (ligue.nomLigue === "Or") return "Platine";
    if (ligue.nomLigue === "Platine") return "Diamant";
    return null;
  }, [ligue.nomLigue]);

  const openMode = (mode: AppMode) => {
    setSelectedMode(mode);
    setCustomTools(MODE_DEFAULT_TOOLS[mode]);
    setPendingMode(appModeToSessionMode(mode));
    if (mode === "blitz") router.push("/app/blitz");
    else if (mode === "libre") router.push(`/app/modes/libre?chapterId=${continueLesson.chapterId}`);
    else if (mode === "guide") router.push("/app/modes/guide");
    else router.push(`/app/modes/cramming?chapterId=${continueLesson.chapterId}`);
  };

  return (
    <div>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-3.5 md:px-8" style={{ background: colors.white }}>
        <Link href="/app/profil" className="flex min-w-0 items-center gap-3">
          <Avatar avatarId={profile.avatarId} size={48} initials={profile.firstName} fallbackColor={profile.color} />
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold" style={{ color: colors.textSecondary }}>
              Salut
            </span>
            <span className="block truncate text-[20px] font-extrabold leading-none" style={{ color: colors.textDark }}>
              {greetingName}
            </span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1 rounded-[14px] bg-[#FEF3C7] px-2.5 py-2 text-[14px] font-extrabold text-[#D97706]">
            <Icon name="flame" size={16} color="#D97706" />
            {profile.streak}
          </span>
          <span className="flex items-center gap-1 rounded-[14px] bg-[#FEF3C7] px-2.5 py-2 text-[14px] font-extrabold text-[#D97706]">
            <Icon name="zap" size={16} color="#D97706" />
            {profile.xpTotale.toLocaleString("fr-FR")}
          </span>
          <Link href="/app/inbox" className="relative flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.surfaceAlt }}>
            <Icon name="bell" size={18} color={colors.textDark} />
            {unread > 0 ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-5 py-5 pb-8 md:px-8">
        <Link
          href={`/app/cours/${continueLesson.chapterId}`}
          className="flex items-center rounded-3xl px-[22px] py-[22px] text-white"
          style={{ background: "linear-gradient(135deg, #1677FF 0%, #00B8F4 100%)" }}
        >
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-[20px] font-extrabold">{continueLesson.title}</p>
            <p className="mt-1.5 text-[15px] font-semibold text-white/90">{continueLesson.lessonLabel}</p>
            <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-white/30">
              <div className="h-full rounded-full bg-white" style={{ width: `${continueLesson.progress}%` }} />
            </div>
          </div>
          <span className="rounded-2xl bg-white px-4 py-3.5 text-[16px] font-extrabold text-[#1677FF]">Continuer</span>
        </Link>

        <ModeWorkSelector selectedMode={selectedMode} guideInactive={dueCount === 0} onSelectMode={openMode} />

        <MesMatieres
          subjects={shortcuts}
          onSelect={(s) => router.push(`/app/cours?subjectId=${s.slug}`)}
          onSeeAll={() => router.push("/app/cours")}
        />

        {todaySessions.length > 0 ? (
          <section className="rounded-3xl border p-5" style={{ background: colors.white, borderColor: colors.border }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold">Aujourd&apos;hui</h2>
              <Link href="/app/agenda" className="text-[15px] font-bold" style={{ color: colors.primary }}>
                Agenda
              </Link>
            </div>
            {todaySessions.map((s) => (
              <div key={s.id} className="flex items-center gap-3.5 py-1.5">
                <span className="w-[52px] text-[15px] font-bold">
                  {String(s.hour).padStart(2, "0")}:{String(s.minute).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[16px] font-bold">{s.subject}</span>
                <span className="text-xs font-extrabold" style={{ color: AGENDA_MODE_CONFIG[s.mode].color }}>
                  {AGENDA_MODE_CONFIG[s.mode].label}
                </span>
              </div>
            ))}
          </section>
        ) : null}

        <section className="rounded-3xl border p-[22px]" style={{ background: colors.white, borderColor: darkMode ? colors.border : "#F1F5F9" }}>
          <h2 className="text-[18px] font-extrabold">Ma progression</h2>
          <div className="mt-5 flex">
            {[
              [String(totalDone), "leçons", colors.textDark],
              ["4.2h", "d'étude", colors.textDark],
              [`+${weekXp}`, "XP", "#F59E0B"],
            ].map(([v, l, c], i) => (
              <div key={l} className={`flex flex-1 flex-col items-center ${i < 2 ? "border-r" : ""}`} style={{ borderColor: darkMode ? colors.border : "#E5E7EB" }}>
                <p className="text-[22px] font-extrabold" style={{ color: c }}>
                  {v}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#9CA3AF]">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex h-[88px] items-end">
            {WEEK_CHART.map((b, i) => (
              <div key={`${b.label}-${i}`} className="flex flex-1 flex-col items-center justify-end">
                <div className="w-[22px] rounded-t-[11px]" style={{ height: b.height, background: b.color }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex">
            {WEEK_CHART.map((b, i) => (
              <div key={`lbl-${i}`} className="flex-1 text-center text-[13px]" style={{ fontWeight: b.today ? 800 : 600, color: b.today ? "#1677FF" : "#9CA3AF" }}>
                {b.label}
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/app/ligue"
          className="flex items-center gap-3.5 rounded-3xl border p-[18px]"
          style={{
            background: darkMode ? "#422006" : "#FFFBEB",
            borderColor: darkMode ? "#78350F" : "#FDE68A",
          }}
        >
          <LeagueBadge nom={ligue.nomLigue} size={56} />
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-extrabold" style={{ color: darkMode ? "#FDE68A" : "#1C1917" }}>
              Ligue {ligue.nomLigue}
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-[#D97706]">#{ligue.rangActuel}</p>
            {nextLigue ? (
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#FDE68A]">
                <div className="h-full w-[30%] rounded-full bg-[#F59E0B]" />
              </div>
            ) : null}
          </div>
          <Icon name="chevron-right" size={20} color="#D97706" />
        </Link>
      </div>
    </div>
  );
}
