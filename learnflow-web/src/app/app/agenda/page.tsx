"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { ScreenHeader } from "@/components/ui";
import { AGENDA_MODE_CONFIG, SUBJECTS } from "@/data/mock";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { StudyModeId } from "@/types/learnflow";

const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEK_DAYS_LONG = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DURATIONS = [15, 30, 45, 60];
const REMINDERS = [
  { label: "Sans rappel", value: 0 },
  { label: "5 min", value: 5 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1h", value: 60 },
];

function fmt(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getWeekMeta() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const nums = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });
  return { todayIdx: mondayOffset, nums };
}

export default function AgendaPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { todayIdx, nums } = useMemo(getWeekMeta, []);
  const sessions = useLearnFlowStore((s) => s.agendaSessions);
  const timetable = useLearnFlowStore((s) => s.timetable);
  const addAgendaSession = useLearnFlowStore((s) => s.addAgendaSession);
  const deleteAgendaSession = useLearnFlowStore((s) => s.deleteAgendaSession);
  const postponeAgendaSession = useLearnFlowStore((s) => s.postponeAgendaSession);
  const addSchoolClass = useLearnFlowStore((s) => s.addSchoolClass);
  const deleteSchoolClass = useLearnFlowStore((s) => s.deleteSchoolClass);

  const [mainTab, setMainTab] = useState<"agenda" | "timetable">("agenda");
  const [view, setView] = useState<"day" | "week">("day");
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [ttDay, setTtDay] = useState(Math.min(todayIdx, 4));
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);

  const [formSubject, setFormSubject] = useState(0);
  const [formMode, setFormMode] = useState<StudyModeId>("guide");
  const [formDay, setFormDay] = useState(todayIdx);
  const [formHour, setFormHour] = useState(18);
  const [formDuration, setFormDuration] = useState(45);
  const [formReminder, setFormReminder] = useState(15);

  const [ttSubject, setTtSubject] = useState(0);
  const [ttDay2, setTtDay2] = useState(0);
  const [ttStartHour, setTtStartHour] = useState(8);
  const [ttEndHour, setTtEndHour] = useState(9);
  const [ttTeacher, setTtTeacher] = useState("");
  const [ttRoom, setTtRoom] = useState("");

  const daySessions = sessions
    .filter((s) => s.day === selectedDay)
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  const dayClasses = timetable
    .filter((c) => c.day === ttDay)
    .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));
  const detail = sessions.find((s) => s.id === detailId) ?? null;
  const detailClass = timetable.find((c) => c.id === classId) ?? null;
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);

  const openAdd = () => {
    if (mainTab === "agenda") {
      setFormDay(selectedDay);
      setShowAddSheet(true);
    } else {
      setTtDay2(ttDay);
      setShowAddClass(true);
    }
  };

  const addSession = () => {
    const subj = SUBJECTS[formSubject];
    addAgendaSession({
      subject: subj.name,
      subjectColor: subj.color,
      subjectBg: subj.bg,
      mode: formMode,
      day: formDay,
      hour: formHour,
      minute: 0,
      duration: formDuration,
      reminderMin: formReminder,
    });
    setShowAddSheet(false);
  };

  const addClass = () => {
    const subj = SUBJECTS[ttSubject];
    addSchoolClass({
      subject: subj.name,
      subjectColor: subj.color,
      subjectBg: subj.bg,
      day: ttDay2,
      startHour: ttStartHour,
      startMinute: 0,
      endHour: ttEndHour,
      endMinute: 0,
      teacher: ttTeacher || undefined,
      room: ttRoom || undefined,
    });
    setShowAddClass(false);
    setTtTeacher("");
    setTtRoom("");
  };

  return (
    <div className="relative min-h-full pb-24">
      <ScreenHeader
        title="Mon Agenda"
        right={
          <button type="button" onClick={openAdd} className="flex h-9 w-9 items-center justify-center rounded-[14px]" style={{ background: colors.primary }}>
            <Icon name="plus" size={17} color="#fff" />
          </button>
        }
      />

      <div className="flex border-b" style={{ background: colors.white, borderColor: colors.border }}>
        {(["agenda", "timetable"] as const).map((key) => (
          <button key={key} type="button" onClick={() => setMainTab(key)} className="flex-1 pt-2.5 text-center">
            <span className="text-[13px] font-extrabold" style={{ color: mainTab === key ? colors.primary : colors.textMuted }}>
              {key === "agenda" ? "Révisions" : "Emploi du temps"}
            </span>
            <span className="mt-2.5 block h-[2.5px] w-full" style={{ background: mainTab === key ? colors.primary : "transparent" }} />
          </button>
        ))}
      </div>

      {mainTab === "agenda" ? (
        <>
          <div className="space-y-2 border-b px-3 pb-2 pt-2.5" style={{ background: colors.white, borderColor: colors.border }}>
            <div className="flex rounded-xl p-1" style={{ background: colors.surfaceAlt }}>
              {(["day", "week"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className="flex-1 rounded-[10px] py-2 text-xs font-extrabold"
                  style={{ background: view === v ? colors.white : "transparent", color: view === v ? colors.primary : colors.textMuted }}
                >
                  {v === "day" ? "Vue Jour" : "Vue Semaine"}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {WEEK_DAYS.map((d, i) => {
                const has = sessions.some((s) => s.day === i);
                const active = i === selectedDay;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(i)}
                    className="flex min-w-0 flex-1 flex-col items-center rounded-xl py-1.5"
                    style={{ background: active ? colors.primary : "transparent" }}
                  >
                    <span className="text-[8px] font-extrabold" style={{ color: active ? "rgba(255,255,255,0.75)" : colors.textMuted }}>
                      {d}
                    </span>
                    <span className="text-[13px] font-extrabold" style={{ color: active ? "#fff" : i === todayIdx ? colors.primary : colors.textDark }}>
                      {nums[i]}
                    </span>
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full" style={{ background: has ? (active ? "#fff" : colors.primary) : "transparent" }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 px-4 py-4">
            {view === "day" ? (
              daySessions.length === 0 ? (
                <EmptyState
                  icon="clock"
                  title="Aucune séance planifiée"
                  hint="Appuie sur + pour planifier"
                  cta="Planifier une séance"
                  onCta={() => setShowAddSheet(true)}
                />
              ) : (
                hours.map((h) => {
                  const at = daySessions.filter((s) => s.hour === h);
                  return (
                    <div key={h} className="flex min-h-9 gap-2.5">
                      <span className="w-10 pt-1 text-[10px] font-extrabold" style={{ color: "#C4C2BF" }}>
                        {fmt(h, 0)}
                      </span>
                      <div className="flex-1 space-y-1.5 border-t pt-1" style={{ borderColor: colors.border }}>
                        {at.map((sess) => {
                          const mc = AGENDA_MODE_CONFIG[sess.mode];
                          return (
                            <button
                              key={sess.id}
                              type="button"
                              onClick={() => setDetailId(sess.id)}
                              className="flex w-full items-center gap-2.5 rounded-[14px] border-2 p-2.5 text-left"
                              style={{ background: sess.subjectBg, borderColor: mc.border }}
                            >
                              <span className="w-1 self-stretch rounded" style={{ background: sess.subjectColor }} />
                              <span className="flex-1">
                                <span className="block text-[13px] font-extrabold" style={{ color: sess.subjectColor }}>
                                  {sess.subject}
                                </span>
                                <span className="text-[10px] font-semibold" style={{ color: mc.color }}>
                                  {mc.label} · {sess.duration} min
                                </span>
                              </span>
                              <span className="text-[11px] font-medium" style={{ color: colors.textMuted }}>
                                {fmt(sess.hour, sess.minute)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              WEEK_DAYS.map((d, di) => {
                const ws = sessions.filter((s) => s.day === di).sort((a, b) => a.hour - b.hour);
                if (!ws.length) return null;
                return (
                  <div key={d} className="mb-3.5">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
                      {d} {nums[di]}
                      {di === todayIdx ? " · Aujourd'hui" : ""}
                    </p>
                    {ws.map((sess) => {
                      const mc = AGENDA_MODE_CONFIG[sess.mode];
                      return (
                        <button
                          key={sess.id}
                          type="button"
                          onClick={() => {
                            setSelectedDay(di);
                            setView("day");
                          }}
                          className="mb-2 flex w-full items-center gap-2.5 rounded-[14px] border-2 p-3 text-left"
                          style={{ background: colors.white, borderColor: mc.border }}
                        >
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: sess.subjectColor }} />
                          <span className="flex-1">
                            <span className="block text-[13px] font-extrabold">{sess.subject}</span>
                            <span className="text-[10px]" style={{ color: mc.color }}>
                              {mc.label} · {sess.duration} min
                            </span>
                          </span>
                          <span className="text-[13px] font-extrabold">{fmt(sess.hour, sess.minute)}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <>
          <div className="border-b px-3 pb-2 pt-2.5" style={{ background: colors.white, borderColor: colors.border }}>
            <div className="flex gap-1">
              {WEEK_DAYS.slice(0, 5).map((d, i) => {
                const has = timetable.some((c) => c.day === i);
                const active = i === ttDay;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTtDay(i)}
                    className="flex min-w-0 flex-1 flex-col items-center rounded-xl py-1.5"
                    style={{ background: active ? colors.primary : "transparent" }}
                  >
                    <span className="text-[8px] font-extrabold" style={{ color: active ? "rgba(255,255,255,0.75)" : colors.textMuted }}>
                      {d}
                    </span>
                    <span className="text-[13px] font-extrabold" style={{ color: active ? "#fff" : colors.textDark }}>
                      {nums[i]}
                    </span>
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full" style={{ background: has ? (active ? "#fff" : colors.primary) : "transparent" }} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-4 py-4">
            {dayClasses.length === 0 ? (
              <EmptyState icon="book" title="Aucun cours ce jour" cta="Ajouter un cours" onCta={() => setShowAddClass(true)} />
            ) : (
              <>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
                  {WEEK_DAYS_LONG[ttDay]} · {dayClasses.length} cours
                </p>
                {dayClasses.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setClassId(c.id)}
                    className="mb-2.5 flex w-full overflow-hidden rounded-2xl border-2 text-left"
                    style={{ background: colors.white, borderColor: `${c.subjectColor}40` }}
                  >
                    <span className="w-1" style={{ background: c.subjectColor }} />
                    <span className="flex-1 p-3">
                      <span
                        className="mb-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold"
                        style={{ background: c.subjectBg, color: c.subjectColor }}
                      >
                        {fmt(c.startHour, c.startMinute)} — {fmt(c.endHour, c.endMinute)}
                      </span>
                      <span className="block text-[13px] font-extrabold">{c.subject}</span>
                      <span className="text-[11px] font-medium" style={{ color: colors.textMuted }}>
                        {[c.teacher, c.room].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span className="m-3 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-extrabold" style={{ background: c.subjectBg, color: c.subjectColor }}>
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-[88px] z-30 flex justify-center md:bottom-6">
        <button
          type="button"
          onClick={openAdd}
          className="pointer-events-auto flex items-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-extrabold text-white shadow-lg"
          style={{ background: colors.primary }}
        >
          <Icon name="plus" size={16} color="#fff" />
          {mainTab === "agenda" ? "Planifier une séance" : "Ajouter un cours"}
        </button>
      </div>

      {detail ? (
        <Sheet onClose={() => setDetailId(null)}>
          <p className="text-base font-extrabold">{detail.subject}</p>
          <p className="text-[11px] font-medium" style={{ color: colors.textMuted }}>
            {AGENDA_MODE_CONFIG[detail.mode].label} · {detail.duration} min · {fmt(detail.hour, detail.minute)}
          </p>
          <button
            type="button"
            onClick={() => {
              setDetailId(null);
              router.push("/app/cours/eq2");
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-extrabold text-white"
            style={{ background: colors.primary }}
          >
            <Icon name="play-circle" size={15} color="#fff" />
            Commencer la session
          </button>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                postponeAgendaSession(detail.id);
                setDetailId(null);
              }}
              className="flex-1 rounded-[14px] py-3 text-sm font-extrabold"
              style={{ background: colors.surfaceAlt, color: "#44403C" }}
            >
              Reporter +1h
            </button>
            <button
              type="button"
              onClick={() => {
                deleteAgendaSession(detail.id);
                setDetailId(null);
              }}
              className="flex-1 rounded-[14px] border-2 py-3 text-sm font-extrabold"
              style={{ background: "#FEF2F2", borderColor: "#FECACA", color: colors.danger }}
            >
              Supprimer
            </button>
          </div>
        </Sheet>
      ) : null}

      {detailClass ? (
        <Sheet onClose={() => setClassId(null)}>
          <p className="text-base font-extrabold">{detailClass.subject}</p>
          <p className="text-[11px] font-medium" style={{ color: colors.textMuted }}>
            {fmt(detailClass.startHour, detailClass.startMinute)} — {fmt(detailClass.endHour, detailClass.endMinute)}
            {detailClass.room ? ` · ${detailClass.room}` : ""}
          </p>
          {detailClass.teacher ? <p className="text-[13px] font-extrabold">{detailClass.teacher}</p> : null}
          <button
            type="button"
            onClick={() => {
              setClassId(null);
              setFormSubject(Math.max(0, SUBJECTS.findIndex((s) => s.name === detailClass.subject)));
              setMainTab("agenda");
              setShowAddSheet(true);
            }}
            className="mt-2 w-full rounded-2xl py-3.5 font-extrabold text-white"
            style={{ background: colors.primary }}
          >
            Planifier une révision
          </button>
          <button
            type="button"
            onClick={() => {
              deleteSchoolClass(detailClass.id);
              setClassId(null);
            }}
            className="mt-2 w-full rounded-[14px] border-2 py-3 text-sm font-extrabold"
            style={{ background: "#FEF2F2", borderColor: "#FECACA", color: colors.danger }}
          >
            Supprimer ce cours
          </button>
        </Sheet>
      ) : null}

      {showAddSheet ? (
        <Sheet onClose={() => setShowAddSheet(false)} tall>
          <p className="text-base font-extrabold">Planifier une séance</p>
          <Field label="Matière">
            {SUBJECTS.map((s, i) => (
              <Chip key={s.id} on={formSubject === i} onClick={() => setFormSubject(i)} onColor={s.color} onBg={s.bg}>
                {s.abbrev}
              </Chip>
            ))}
          </Field>
          <Field label="Mode">
            {(Object.keys(AGENDA_MODE_CONFIG) as StudyModeId[]).map((key) => {
              const mc = AGENDA_MODE_CONFIG[key];
              return (
                <Chip key={key} on={formMode === key} onClick={() => setFormMode(key)} onColor={mc.color} onBg={mc.bg} wide>
                  {mc.label}
                </Chip>
              );
            })}
          </Field>
          <Field label="Jour">
            {WEEK_DAYS.map((d, i) => (
              <Chip key={d} on={formDay === i} onClick={() => setFormDay(i)}>
                {d}
              </Chip>
            ))}
          </Field>
          <Field label="Heure">
            {[14, 15, 16, 17, 18, 19, 20, 21].map((h) => (
              <Chip key={h} on={formHour === h} onClick={() => setFormHour(h)}>
                {fmt(h, 0)}
              </Chip>
            ))}
          </Field>
          <Field label="Durée">
            {DURATIONS.map((d) => (
              <Chip key={d} on={formDuration === d} onClick={() => setFormDuration(d)}>
                {d < 60 ? `${d} min` : "1h"}
              </Chip>
            ))}
          </Field>
          <Field label="Rappel">
            {REMINDERS.map((r) => (
              <Chip key={r.value} on={formReminder === r.value} onClick={() => setFormReminder(r.value)}>
                {r.label}
              </Chip>
            ))}
          </Field>
          <button type="button" onClick={addSession} className="mt-3 w-full rounded-2xl py-3.5 font-extrabold text-white" style={{ background: colors.primary }}>
            Planifier la séance
          </button>
        </Sheet>
      ) : null}

      {showAddClass ? (
        <Sheet onClose={() => setShowAddClass(false)} tall>
          <p className="text-base font-extrabold">Ajouter un cours</p>
          <Field label="Matière">
            {SUBJECTS.map((s, i) => (
              <Chip key={s.id} on={ttSubject === i} onClick={() => setTtSubject(i)} onColor={s.color} onBg={s.bg}>
                {s.abbrev}
              </Chip>
            ))}
          </Field>
          <Field label="Jour">
            {WEEK_DAYS.slice(0, 5).map((d, i) => (
              <Chip key={d} on={ttDay2 === i} onClick={() => setTtDay2(i)}>
                {d}
              </Chip>
            ))}
          </Field>
          <Field label="Début">
            {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((h) => (
              <Chip key={`s${h}`} on={ttStartHour === h} onClick={() => setTtStartHour(h)}>
                {fmt(h, 0)}
              </Chip>
            ))}
          </Field>
          <Field label="Fin">
            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => (
              <Chip key={`e${h}`} on={ttEndHour === h} onClick={() => setTtEndHour(h)}>
                {fmt(h, 0)}
              </Chip>
            ))}
          </Field>
          <label className="mt-2.5 block text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Professeur (optionnel)
          </label>
          <input
            value={ttTeacher}
            onChange={(e) => setTtTeacher(e.target.value)}
            placeholder="Ex : M. Kokou"
            className="mt-1.5 w-full rounded-[14px] border-2 px-3.5 py-3 text-sm outline-none"
            style={{ borderColor: "#E7E5E4", background: colors.white, color: colors.textDark }}
          />
          <label className="mt-2.5 block text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Salle (optionnel)
          </label>
          <input
            value={ttRoom}
            onChange={(e) => setTtRoom(e.target.value)}
            placeholder="Ex : Salle 12"
            className="mt-1.5 w-full rounded-[14px] border-2 px-3.5 py-3 text-sm outline-none"
            style={{ borderColor: "#E7E5E4", background: colors.white, color: colors.textDark }}
          />
          <button type="button" onClick={addClass} className="mt-3 w-full rounded-2xl py-3.5 font-extrabold text-white" style={{ background: colors.primary }}>
            Enregistrer le cours
          </button>
        </Sheet>
      ) : null}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  hint,
  cta,
  onCta,
}: {
  icon: "clock" | "book";
  title: string;
  hint?: string;
  cta: string;
  onCta: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <Icon name={icon} size={28} color="#C4C2BF" />
      <p className="text-sm font-extrabold">{title}</p>
      {hint ? (
        <p className="text-[11px] font-medium" style={{ color: colors.textMuted }}>
          {hint}
        </p>
      ) : null}
      <button type="button" onClick={onCta} className="mt-2 flex items-center gap-2 rounded-2xl px-[18px] py-3.5 font-extrabold text-white" style={{ background: colors.primary }}>
        <Icon name="plus" size={14} color="#fff" />
        {cta}
      </button>
    </div>
  );
}

function Sheet({ children, onClose, tall }: { children: React.ReactNode; onClose: () => void; tall?: boolean }) {
  const { colors } = useAppTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} aria-label="Fermer" />
      <div
        className={`relative z-10 w-full max-w-lg space-y-2.5 overflow-y-auto rounded-t-3xl p-5 md:rounded-3xl ${tall ? "max-h-[80vh]" : ""}`}
        style={{ background: colors.white }}
      >
        <span className="mx-auto block h-1 w-10 rounded-full" style={{ background: colors.surfaceAlt }} />
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <div>
      <p className="mb-1.5 mt-2.5 text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  children,
  on,
  onClick,
  onColor,
  onBg,
  wide,
}: {
  children: React.ReactNode;
  on: boolean;
  onClick: () => void;
  onColor?: string;
  onBg?: string;
  wide?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 px-3 py-2 text-xs font-extrabold ${wide ? "w-[calc(50%-4px)]" : ""}`}
      style={{
        background: on ? (onBg ?? colors.mathsBg) : colors.white,
        borderColor: on ? (onColor ?? colors.primary) : "#E7E5E4",
        color: on ? (onColor ?? colors.primary) : "#78716C",
      }}
    >
      {children}
    </button>
  );
}
