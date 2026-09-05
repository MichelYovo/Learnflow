import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import { AGENDA_MODE_CONFIG, SUBJECTS } from "../../data/mock";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { StudyModeId } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type MainTab = "agenda" | "timetable";
type ViewMode = "day" | "week";

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

export default function AgendaScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { todayIdx, nums } = useMemo(getWeekMeta, []);
  const sessions = useLearnFlowStore((s) => s.agendaSessions);
  const timetable = useLearnFlowStore((s) => s.timetable);
  const addAgendaSession = useLearnFlowStore((s) => s.addAgendaSession);
  const deleteAgendaSession = useLearnFlowStore((s) => s.deleteAgendaSession);
  const postponeAgendaSession = useLearnFlowStore((s) => s.postponeAgendaSession);
  const addSchoolClass = useLearnFlowStore((s) => s.addSchoolClass);
  const deleteSchoolClass = useLearnFlowStore((s) => s.deleteSchoolClass);
  const { colors } = useAppTheme();

  const [mainTab, setMainTab] = useState<MainTab>("agenda");
  const [view, setView] = useState<ViewMode>("day");
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <Pressable onPress={() => nav.goBack()} style={[styles.roundBtn, { backgroundColor: colors.surfaceAlt }]}>
          <Icon name="arrow-left" size={17} color={colors.textDark} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.textDark }]}>Mon Agenda</Text>
        </View>
        <Pressable
          onPress={() => (mainTab === "agenda" ? setShowAddSheet(true) : setShowAddClass(true))}
          style={styles.addBtn}
        >
          <Icon name="plus" size={17} color={colors.onPrimary} />
        </Pressable>
      </View>

      <View style={[styles.mainTabs, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        {(["agenda", "timetable"] as const).map((key) => (
          <Pressable key={key} onPress={() => setMainTab(key)} style={styles.mainTab}>
            <Text style={[styles.mainTabText, mainTab === key && styles.mainTabTextOn]}>
              {key === "agenda" ? "Révisions" : "Emploi du temps"}
            </Text>
            <View style={[styles.mainTabLine, mainTab === key && styles.mainTabLineOn]} />
          </Pressable>
        ))}
      </View>

      {mainTab === "agenda" ? (
        <>
          <View style={[styles.toolbar, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
            <View style={styles.seg}>
              {(["day", "week"] as const).map((v) => (
                <Pressable key={v} onPress={() => setView(v)} style={[styles.segBtn, view === v && styles.segOn]}>
                  <Text style={[styles.segText, view === v && styles.segTextOn]}>{v === "day" ? "Vue Jour" : "Vue Semaine"}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.days}>
              {WEEK_DAYS.map((d, i) => {
                const has = sessions.some((s) => s.day === i);
                const active = i === selectedDay;
                return (
                  <Pressable key={d} onPress={() => setSelectedDay(i)} style={[styles.dayBtn, active && styles.dayOn]}>
                    <Text style={[styles.dayLabel, active && { color: "rgba(255,255,255,0.75)" }]}>{d}</Text>
                    <Text style={[styles.dayNum, { color: active ? colors.onPrimary : i === todayIdx ? colors.primary : colors.textDark }]}>
                      {nums[i]}
                    </Text>
                    <View style={[styles.miniDot, { backgroundColor: has ? (active ? colors.onPrimary : colors.primary) : "transparent" }]} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {view === "day" ? (
              daySessions.length === 0 ? (
                <View style={styles.empty}>
                  <Icon name="clock" size={28} color="#C4C2BF" />
                  <Text style={[styles.emptyTitle, { color: colors.textDark }]}>Aucune séance planifiée</Text>
                  <Text style={styles.muted}>Appuie sur + pour planifier</Text>
                  <Pressable style={styles.cta} onPress={() => setShowAddSheet(true)}>
                    <Icon name="plus" size={14} color={colors.onPrimary} />
                    <Text style={styles.ctaText}>Planifier une séance</Text>
                  </Pressable>
                </View>
              ) : (
                hours.map((h) => {
                  const at = daySessions.filter((s) => s.hour === h);
                  return (
                    <View key={h} style={styles.hourRow}>
                      <Text style={styles.hourLabel}>{fmt(h, 0)}</Text>
                      <View style={styles.hourLine}>
                        {at.map((sess) => {
                          const mc = AGENDA_MODE_CONFIG[sess.mode];
                          return (
                            <Pressable
                              key={sess.id}
                              onPress={() => setDetailId(sess.id)}
                              style={[styles.sessCard, { backgroundColor: sess.subjectBg, borderColor: mc.border }]}
                            >
                              <View style={[styles.strip, { backgroundColor: sess.subjectColor }]} />
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.sessTitle, { color: sess.subjectColor }]}>{sess.subject}</Text>
                                <Text style={{ color: mc.color, fontSize: 10, fontWeight: "600" }}>
                                  {mc.label} · {sess.duration} min
                                </Text>
                              </View>
                              <Text style={styles.muted}>{fmt(sess.hour, sess.minute)}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  );
                })
              )
            ) : (
              WEEK_DAYS.map((d, di) => {
                const ws = sessions.filter((s) => s.day === di).sort((a, b) => a.hour - b.hour);
                if (!ws.length) return null;
                return (
                  <View key={d} style={{ marginBottom: 14 }}>
                    <Text style={styles.weekHead}>
                      {d} {nums[di]}
                      {di === todayIdx ? " · Aujourd'hui" : ""}
                    </Text>
                    {ws.map((sess) => {
                      const mc = AGENDA_MODE_CONFIG[sess.mode];
                      return (
                        <Pressable
                          key={sess.id}
                          onPress={() => {
                            setSelectedDay(di);
                            setView("day");
                          }}
                          style={[styles.weekCard, { backgroundColor: colors.white, borderColor: mc.border }]}
                        >
                          <View style={[styles.dot, { backgroundColor: sess.subjectColor }]} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{sess.subject}</Text>
                            <Text style={{ color: mc.color, fontSize: 10 }}>{mc.label} · {sess.duration} min</Text>
                          </View>
                          <Text style={styles.cardTitle}>{fmt(sess.hour, sess.minute)}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                );
              })
            )}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={[styles.toolbar, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
            <View style={styles.days}>
              {WEEK_DAYS.slice(0, 5).map((d, i) => {
                const has = timetable.some((c) => c.day === i);
                const active = i === ttDay;
                return (
                  <Pressable key={d} onPress={() => setTtDay(i)} style={[styles.dayBtn, active && styles.dayOn]}>
                    <Text style={[styles.dayLabel, active && { color: "rgba(255,255,255,0.75)" }]}>{d}</Text>
                    <Text style={[styles.dayNum, { color: active ? colors.onPrimary : colors.textDark }]}>{nums[i]}</Text>
                    <View style={[styles.miniDot, { backgroundColor: has ? (active ? colors.onPrimary : colors.primary) : "transparent" }]} />
                  </Pressable>
                );
              })}
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {dayClasses.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="book" size={28} color="#C4C2BF" />
                <Text style={[styles.emptyTitle, { color: colors.textDark }]}>Aucun cours ce jour</Text>
                <Pressable style={styles.cta} onPress={() => setShowAddClass(true)}>
                  <Icon name="plus" size={14} color={colors.onPrimary} />
                  <Text style={styles.ctaText}>Ajouter un cours</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.weekHead}>
                  {WEEK_DAYS_LONG[ttDay]} · {dayClasses.length} cours
                </Text>
                {dayClasses.map((c, idx) => (
                  <Pressable key={c.id} onPress={() => setClassId(c.id)} style={[styles.classCard, { backgroundColor: colors.white, borderColor: `${c.subjectColor}40` }]}>
                    <View style={[styles.strip, { backgroundColor: c.subjectColor, width: 4 }]} />
                    <View style={{ flex: 1, padding: 12 }}>
                      <Text style={[styles.timePill, { backgroundColor: c.subjectBg, color: c.subjectColor }]}>
                        {fmt(c.startHour, c.startMinute)} — {fmt(c.endHour, c.endMinute)}
                      </Text>
                      <Text style={styles.cardTitle}>{c.subject}</Text>
                      <Text style={styles.muted}>
                        {[c.teacher, c.room].filter(Boolean).join(" · ")}
                      </Text>
                    </View>
                    <View style={[styles.numBadge, { backgroundColor: c.subjectBg }]}>
                      <Text style={{ color: c.subjectColor, fontWeight: "800" }}>{idx + 1}</Text>
                    </View>
                  </Pressable>
                ))}
              </>
            )}
          </ScrollView>
        </>
      )}

      <View style={[styles.fabWrap, { paddingBottom: Math.max(insets.bottom, 16) }]} pointerEvents="box-none">
        <Pressable
          style={styles.fab}
          onPress={() => (mainTab === "agenda" ? setShowAddSheet(true) : setShowAddClass(true))}
        >
          <Icon name="plus" size={16} color={colors.onPrimary} />
          <Text style={styles.fabText}>{mainTab === "agenda" ? "Planifier une séance" : "Ajouter un cours"}</Text>
        </Pressable>
      </View>

      <Modal visible={!!detail} transparent animationType="slide" onRequestClose={() => setDetailId(null)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.overlay} onPress={() => setDetailId(null)} />
          {detail ? (
          <View style={[styles.sheet, { backgroundColor: colors.white, paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.handle} />
            <Text style={[styles.sheetTitle, { color: colors.textDark }]}>{detail.subject}</Text>
            <Text style={styles.muted}>
              {AGENDA_MODE_CONFIG[detail.mode].label} · {detail.duration} min · {fmt(detail.hour, detail.minute)}
            </Text>
            <Pressable
              style={styles.cta}
              onPress={() => {
                setDetailId(null);
                nav.navigate("Course", { chapterId: "eq2" });
              }}
            >
              <Icon name="play-circle" size={15} color={colors.onPrimary} />
              <Text style={styles.ctaText}>Commencer la session</Text>
            </Pressable>
            <View style={styles.row}>
              <Pressable
                style={styles.secondary}
                onPress={() => {
                  postponeAgendaSession(detail.id);
                  setDetailId(null);
                }}
              >
                <Text style={styles.secondaryText}>Reporter +1h</Text>
              </Pressable>
              <Pressable
                style={styles.danger}
                onPress={() => {
                  deleteAgendaSession(detail.id);
                  setDetailId(null);
                }}
              >
                <Text style={styles.dangerText}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        </View>
      </Modal>

      <Modal visible={!!detailClass} transparent animationType="slide" onRequestClose={() => setClassId(null)}>
        <View style={styles.modalRoot}>
        <Pressable style={styles.overlay} onPress={() => setClassId(null)} />
        {detailClass ? (
          <View style={[styles.sheet, { backgroundColor: colors.white, paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.handle} />
            <Text style={[styles.sheetTitle, { color: colors.textDark }]}>{detailClass.subject}</Text>
            <Text style={styles.muted}>
              {fmt(detailClass.startHour, detailClass.startMinute)} — {fmt(detailClass.endHour, detailClass.endMinute)}
              {detailClass.room ? ` · ${detailClass.room}` : ""}
            </Text>
            {detailClass.teacher ? <Text style={styles.cardTitle}>{detailClass.teacher}</Text> : null}
            <Pressable
              style={styles.cta}
              onPress={() => {
                setClassId(null);
                setFormSubject(Math.max(0, SUBJECTS.findIndex((s) => s.name === detailClass.subject)));
                setMainTab("agenda");
                setShowAddSheet(true);
              }}
            >
              <Text style={styles.ctaText}>Planifier une révision</Text>
            </Pressable>
            <Pressable
              style={styles.danger}
              onPress={() => {
                deleteSchoolClass(detailClass.id);
                setClassId(null);
              }}
            >
              <Text style={styles.dangerText}>Supprimer ce cours</Text>
            </Pressable>
          </View>
        ) : null}
        </View>
      </Modal>

      <Modal visible={showAddSheet} transparent animationType="slide" onRequestClose={() => setShowAddSheet(false)}>
        <View style={styles.modalRoot}>
        <Pressable style={styles.overlay} onPress={() => setShowAddSheet(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.white, maxHeight: "80%", paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.handle} />
          <Text style={[styles.sheetTitle, { color: colors.textDark }]}>Planifier une séance</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Matière</Text>
            <View style={styles.wrap}>
              {SUBJECTS.map((s, i) => (
                <Pressable
                  key={s.id}
                  onPress={() => setFormSubject(i)}
                  style={[styles.chip, formSubject === i && { backgroundColor: s.bg, borderColor: s.color }]}
                >
                  <Text style={[styles.chipText, formSubject === i && { color: s.color }]}>{s.abbrev}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Mode</Text>
            <View style={styles.wrap}>
              {(Object.keys(AGENDA_MODE_CONFIG) as StudyModeId[]).map((key) => {
                const mc = AGENDA_MODE_CONFIG[key];
                const on = formMode === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setFormMode(key)}
                    style={[styles.modeChip, on && { backgroundColor: mc.bg, borderColor: mc.color }]}
                  >
                    <Text style={[styles.chipText, on && { color: mc.color }]}>{mc.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.fieldLabel}>Jour</Text>
            <View style={styles.wrap}>
              {WEEK_DAYS.map((d, i) => (
                <Pressable key={d} onPress={() => setFormDay(i)} style={[styles.chip, formDay === i && styles.chipOn]}>
                  <Text style={[styles.chipText, formDay === i && styles.chipTextOn]}>{d}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Heure</Text>
            <View style={styles.wrap}>
              {[14, 15, 16, 17, 18, 19, 20, 21].map((h) => (
                <Pressable key={h} onPress={() => setFormHour(h)} style={[styles.chip, formHour === h && styles.chipOn]}>
                  <Text style={[styles.chipText, formHour === h && styles.chipTextOn]}>{fmt(h, 0)}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Durée</Text>
            <View style={styles.wrap}>
              {DURATIONS.map((d) => (
                <Pressable key={d} onPress={() => setFormDuration(d)} style={[styles.chip, formDuration === d && styles.chipOn]}>
                  <Text style={[styles.chipText, formDuration === d && styles.chipTextOn]}>{d < 60 ? `${d} min` : "1h"}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Rappel</Text>
            <View style={styles.wrap}>
              {REMINDERS.map((r) => (
                <Pressable key={r.value} onPress={() => setFormReminder(r.value)} style={[styles.chip, formReminder === r.value && styles.chipOn]}>
                  <Text style={[styles.chipText, formReminder === r.value && styles.chipTextOn]}>{r.label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={[styles.cta, { marginTop: 12 }]} onPress={addSession}>
              <Text style={styles.ctaText}>Planifier la séance</Text>
            </Pressable>
          </ScrollView>
        </View>
        </View>
      </Modal>

      <Modal visible={showAddClass} transparent animationType="slide" onRequestClose={() => setShowAddClass(false)}>
        <View style={styles.modalRoot}>
        <Pressable style={styles.overlay} onPress={() => setShowAddClass(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.white, maxHeight: "80%", paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.handle} />
          <Text style={[styles.sheetTitle, { color: colors.textDark }]}>Ajouter un cours</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Matière</Text>
            <View style={styles.wrap}>
              {SUBJECTS.map((s, i) => (
                <Pressable
                  key={s.id}
                  onPress={() => setTtSubject(i)}
                  style={[styles.chip, ttSubject === i && { backgroundColor: s.bg, borderColor: s.color }]}
                >
                  <Text style={[styles.chipText, ttSubject === i && { color: s.color }]}>{s.abbrev}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Jour</Text>
            <View style={styles.wrap}>
              {WEEK_DAYS.slice(0, 5).map((d, i) => (
                <Pressable key={d} onPress={() => setTtDay2(i)} style={[styles.chip, ttDay2 === i && styles.chipOn]}>
                  <Text style={[styles.chipText, ttDay2 === i && styles.chipTextOn]}>{d}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Début / Fin</Text>
            <View style={styles.wrap}>
              {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((h) => (
                <Pressable key={`s${h}`} onPress={() => setTtStartHour(h)} style={[styles.chip, ttStartHour === h && styles.chipOn]}>
                  <Text style={[styles.chipText, ttStartHour === h && styles.chipTextOn]}>{fmt(h, 0)}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.wrap}>
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => (
                <Pressable key={`e${h}`} onPress={() => setTtEndHour(h)} style={[styles.chip, ttEndHour === h && styles.chipOn]}>
                  <Text style={[styles.chipText, ttEndHour === h && styles.chipTextOn]}>{fmt(h, 0)}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Professeur (optionnel)</Text>
            <TextInput style={styles.input} placeholder="Ex : M. Kokou" value={ttTeacher} onChangeText={setTtTeacher} />
            <Text style={styles.fieldLabel}>Salle (optionnel)</Text>
            <TextInput style={styles.input} placeholder="Ex : Salle 12" value={ttRoom} onChangeText={setTtRoom} />
            <Pressable style={[styles.cta, { marginTop: 12 }]} onPress={addClass}>
              <Text style={styles.ctaText}>Enregistrer le cours</Text>
            </Pressable>
          </ScrollView>
        </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F8FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  roundBtn: { width: 36, height: 36, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  addBtn: { width: 36, height: 36, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  mainTabs: { flexDirection: "row", backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  mainTab: { flex: 1, alignItems: "center", paddingTop: 10 },
  mainTabText: { fontSize: 13, fontWeight: "800", color: colors.textMuted },
  mainTabTextOn: { color: colors.primary },
  mainTabLine: { height: 2.5, width: "100%", marginTop: 10, backgroundColor: "transparent" },
  mainTabLineOn: { backgroundColor: colors.primary },
  toolbar: { backgroundColor: colors.white, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8, gap: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  seg: { flexDirection: "row", backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 4 },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  segOn: { backgroundColor: colors.white },
  segText: { fontSize: 12, fontWeight: "800", color: colors.textMuted },
  segTextOn: { color: colors.primary },
  days: { flexDirection: "row", gap: 4 },
  dayBtn: { flex: 1, alignItems: "center", paddingVertical: 6, borderRadius: 12, minWidth: 0 },
  dayOn: { backgroundColor: colors.primary },
  dayLabel: { fontSize: 8, fontWeight: "800", color: colors.textMuted },
  dayNum: { fontSize: 13, fontWeight: "800" },
  miniDot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  scroll: { padding: 16, paddingBottom: 110 },
  empty: { alignItems: "center", paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 14, fontWeight: "800", color: "#44403C" },
  muted: { fontSize: 11, color: colors.textMuted, fontWeight: "500" },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  ctaText: { color: colors.white, fontWeight: "800" },
  hourRow: { flexDirection: "row", gap: 10, minHeight: 36 },
  hourLabel: { width: 40, fontSize: 10, fontWeight: "800", color: "#C4C2BF", paddingTop: 4 },
  hourLine: { flex: 1, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 4, gap: 6 },
  sessCard: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 2, borderRadius: 14, padding: 10 },
  strip: { width: 4, alignSelf: "stretch", borderRadius: 4 },
  sessTitle: { fontSize: 13, fontWeight: "800" },
  weekHead: { fontSize: 10, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  weekCard: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.white, borderWidth: 2, borderRadius: 14, padding: 12, marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  cardTitle: { fontSize: 13, fontWeight: "800", color: colors.textDark },
  classCard: { flexDirection: "row", backgroundColor: colors.white, borderWidth: 2, borderRadius: 16, overflow: "hidden", marginBottom: 10, alignItems: "center" },
  timePill: { alignSelf: "flex-start", fontSize: 9, fontWeight: "800", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: "hidden", marginBottom: 4 },
  numBadge: { width: 32, height: 32, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  fabWrap: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center" },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fabText: { color: colors.white, fontWeight: "800", fontSize: 13 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.45)" },
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 10 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.surfaceAlt, alignSelf: "center" },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  row: { flexDirection: "row", gap: 8 },
  secondary: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  secondaryText: { fontWeight: "800", color: "#44403C" },
  danger: { flex: 1, backgroundColor: "#FEF2F2", borderRadius: 14, paddingVertical: 12, alignItems: "center", borderWidth: 2, borderColor: "#FECACA" },
  dangerText: { fontWeight: "800", color: colors.danger },
  fieldLabel: { fontSize: 10, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 1, marginTop: 10, marginBottom: 6 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 2, borderColor: "#E7E5E4", backgroundColor: colors.white },
  chipOn: { backgroundColor: colors.mathsBg, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "800", color: "#78716C" },
  chipTextOn: { color: colors.primary },
  modeChip: { width: "48%", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: "#E7E5E4" },
  input: {
    borderWidth: 2,
    borderColor: "#E7E5E4",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textDark,
  },
});
