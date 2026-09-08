"use client";

import { useCallback, useEffect, useState } from "react";
import FileDropZone from "@/components/FileDropZone";
import { useIncomingFiles } from "@/hooks/useIncomingFiles";
import { CLASS_GROUPS, subjectsForClass } from "@/lib/brand";
import { emptyPayload, type CoursePayload } from "@/lib/contentTypes";
import { COURSE_ACCEPT } from "@/lib/files";

type Draft = {
  id: string;
  class_level: string;
  subject_id: string;
  chapter_id: string;
  chapter_title: string;
  source_name?: string;
  payload: CoursePayload;
  status: string;
};

export default function ProfStudio() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [active, setActive] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [classLevel, setClassLevel] = useState("3eme");
  const [subjectId, setSubjectId] = useState("svt");
  const [chapterId, setChapterId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [publishWeb, setPublishWeb] = useState(true);
  const [publishMobile, setPublishMobile] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/prof/drafts");
    const json = (await res.json()) as { drafts?: Draft[]; error?: string };
    setDrafts(json.drafts ?? []);
    if (json.error) setError(json.error);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const receiveFile = useCallback((next: File) => {
    setFile(next);
    setError("");
    setMessage(`Fichier prêt : ${next.name}`);
  }, []);

  const { dragging } = useIncomingFiles({
    accept: COURSE_ACCEPT,
    enabled: !busy,
    onFile: receiveFile,
    onError: setError,
  });

  const generate = async () => {
    setBusy(true);
    setError("");
    setMessage("Prof lit le cours…");
    const form = new FormData();
    form.set("class_level", classLevel);
    form.set("subject_id", subjectId);
    form.set("chapter_id", chapterId.trim() || `ch-${Date.now()}`);
    form.set("chapter_title", chapterTitle.trim() || "Nouveau chapitre");
    form.set("text", text);
    if (file) form.set("file", file);
    const res = await fetch("/api/prof/generate", { method: "POST", body: form });
    const json = (await res.json()) as { error?: string; draft?: Draft; warning?: string };
    setBusy(false);
    if (!res.ok) {
      setMessage("");
      setError(json.error || "Prof n’a pas pu générer.");
      return;
    }
    setMessage(json.warning ? `Brouillon prêt (${json.warning})` : "Brouillon prêt. Relis et corrige avant d’envoyer.");
    await load();
    if (json.draft) setActive({ ...json.draft, payload: json.draft.payload ?? emptyPayload() });
  };

  const saveDraft = async () => {
    if (!active) return;
    setBusy(true);
    const res = await fetch(`/api/prof/drafts/${active.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });
    setBusy(false);
    setMessage(res.ok ? "Brouillon enregistré." : "Enregistrement impossible.");
    await load();
  };

  const publish = async () => {
    if (!active) return;
    setBusy(true);
    const res = await fetch("/api/prof/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        class_level: active.class_level,
        subject_id: active.subject_id,
        chapter_id: active.chapter_id,
        chapter_title: active.chapter_title,
        payload: active.payload,
        publish_web: publishWeb,
        publish_mobile: publishMobile,
      }),
    });
    const json = (await res.json()) as { error?: string };
    setBusy(false);
    setMessage(res.ok ? "Cours envoyé sur la plateforme choisie." : json.error || "Publication impossible.");
  };

  const payload = active?.payload ?? emptyPayload();
  const dropProps = {
    accept: COURSE_ACCEPT,
    file,
    disabled: busy,
    hot: dragging,
    onFile: receiveFile,
    onError: setError,
    onClear: () => setFile(null),
    hint: "PDF, image ou .txt — glisse, clique ou colle (Ctrl+V)",
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      {dragging ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
          <p className="rounded-full bg-[#1677FF] px-5 py-2 text-sm font-extrabold text-white shadow-lg">
            Relâche n’importe où pour déposer le fichier
          </p>
        </div>
      ) : null}
      <aside className="space-y-3">
        <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-4">
          <h2 className="font-black text-[#1C1917]">Nouveau cours</h2>
          <label className="mt-3 block text-xs font-extrabold text-[#64748B]">
            Classe
            <select value={classLevel} onChange={(e) => { setClassLevel(e.target.value); setSubjectId((prev) => subjectsForClass(e.target.value).some((s) => s.id === prev) ? prev : "svt"); }} className="mt-1 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-2 text-sm font-bold">
              {CLASS_GROUPS.map((g) => (
                <optgroup key={g.id} label={g.label}>
                  {g.classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="mt-2 block text-xs font-extrabold text-[#64748B]">
            Matière
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="mt-1 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-2 text-sm font-bold">
              {subjectsForClass(classLevel).map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
          <input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} placeholder="Titre du chapitre" className="mt-2 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-3 text-sm font-bold" />
          <input value={chapterId} onChange={(e) => setChapterId(e.target.value)} placeholder="id (ex. digestion)" className="mt-2 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-3 text-sm font-bold" />
          <div className="mt-3">
            <FileDropZone compact title="Déposer le cours" {...dropProps} />
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Ou colle le texte du cours…" className="mt-2 w-full rounded-xl border-2 border-[#F0EFEE] p-2 text-sm" />
          <button type="button" disabled={busy} onClick={() => void generate()} className="mt-2 w-full rounded-2xl bg-[#1677FF] py-2.5 text-sm font-extrabold text-white disabled:opacity-60">
            {busy ? "Prof travaille…" : "Analyser avec Prof"}
          </button>
        </article>
        <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-4">
          <h2 className="font-black text-[#1C1917]">Brouillons</h2>
          <ul className="mt-2 space-y-1">
            {drafts.map((d) => (
              <li key={d.id}>
                <button type="button" onClick={() => setActive({ ...d, payload: d.payload ?? emptyPayload() })} className={`w-full rounded-xl px-3 py-2 text-left text-sm font-bold ${active?.id === d.id ? "bg-[#E6F4FF] text-[#1677FF]" : "text-[#475569]"}`}>
                  {d.chapter_title}
                  <span className="block text-[11px] font-semibold text-[#94A3B8]">{d.class_level} · {d.subject_id}</span>
                </button>
              </li>
            ))}
            {drafts.length === 0 ? <p className="text-xs font-semibold text-[#A8A29E]">Aucun brouillon.</p> : null}
          </ul>
        </article>
      </aside>

      <section className="space-y-4">
        {error ? <p className="rounded-2xl bg-[#FEF2F2] px-4 py-3 text-sm font-bold text-[#DC2626]">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-[#E6F4FF] px-4 py-3 text-sm font-bold text-[#1677FF]">{message}</p> : null}
        {!active ? (
          <FileDropZone title="Glisse le PDF ou l’image ici" {...dropProps} />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <input value={active.chapter_title} onChange={(e) => setActive({ ...active, chapter_title: e.target.value })} className="h-11 min-w-[200px] flex-1 rounded-2xl border-2 border-[#F0EFEE] px-3 font-black" />
              <button type="button" disabled={busy} onClick={() => void saveDraft()} className="rounded-2xl bg-[#F1F5F9] px-4 py-2 text-sm font-extrabold">Sauver</button>
            </div>
            <label className="block text-xs font-extrabold text-[#64748B]">
              L&apos;Essentiel (synthèse autonome, [mots] entre crochets)
              <textarea
                rows={8}
                value={payload.fiche.essentialText ?? payload.fiche.pucesEssentiel.join("\n")}
                onChange={(e) => {
                  const essentialText = e.target.value;
                  setActive({
                    ...active,
                    payload: {
                      ...payload,
                      fiche: {
                        ...payload.fiche,
                        essentialText,
                        pucesEssentiel: essentialText
                          .split(/\n+/)
                          .map((l) => l.replace(/^[•\-]\s+/, "").trim())
                          .filter(Boolean),
                      },
                    },
                  });
                }}
                className="mt-1 w-full rounded-2xl border-2 border-[#F0EFEE] p-3 text-sm leading-relaxed"
              />
            </label>
            <label className="block text-xs font-extrabold text-[#64748B]">
              En Détails (cours APC complet, lecture continue)
              <textarea
                rows={10}
                value={payload.fiche.detailedText ?? payload.fiche.sectionsDetaillees.map((s) => `${s.titre}\n${s.paragraphes.join("\n")}`).join("\n\n")}
                onChange={(e) => {
                  const detailedText = e.target.value;
                  setActive({
                    ...active,
                    payload: {
                      ...payload,
                      fiche: {
                        ...payload.fiche,
                        detailedText,
                        sectionsDetaillees: detailedText.trim()
                          ? [{ id: "s1", titre: "Cours développé", paragraphes: [detailedText] }]
                          : payload.fiche.sectionsDetaillees,
                      },
                    },
                  });
                }}
                className="mt-1 w-full rounded-2xl border-2 border-[#F0EFEE] p-3 text-sm leading-relaxed"
              />
            </label>
            <label className="block text-xs font-extrabold text-[#64748B]">
              Quiz (JSON)
              <textarea
                rows={10}
                value={JSON.stringify(payload.quiz, null, 2)}
                onChange={(e) => {
                  try {
                    setActive({ ...active, payload: { ...payload, quiz: JSON.parse(e.target.value) } });
                  } catch {
                    /* keep typing */
                  }
                }}
                className="mt-1 w-full rounded-2xl border-2 border-[#F0EFEE] p-3 font-mono text-xs"
              />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={publishWeb} onChange={(e) => setPublishWeb(e.target.checked)} /> Web
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={publishMobile} onChange={(e) => setPublishMobile(e.target.checked)} /> Mobile
              </label>
              <button type="button" disabled={busy || (!publishWeb && !publishMobile)} onClick={() => void publish()} className="rounded-2xl bg-[#10B981] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60">
                Envoyer le cours
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
