"use client";

import { useCallback, useEffect, useState } from "react";
import FileDropZone from "@/components/FileDropZone";
import { useIncomingFiles } from "@/hooks/useIncomingFiles";
import { CLASS_GROUPS } from "@/lib/brand";
import type { SchemaPart } from "@/lib/contentTypes";
import { IMAGE_ACCEPT } from "@/lib/files";

type Model = {
  id: string;
  class_level: string;
  chapter_id: string;
  title: string;
  subtitle: string;
  image_url: string;
  parts: SchemaPart[];
  publish_web: boolean;
  publish_mobile: boolean;
};

export default function SchemaStudio() {
  const [models, setModels] = useState<Model[]>([]);
  const [active, setActive] = useState<Model | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [classLevel, setClassLevel] = useState("3eme");
  const [chapterId, setChapterId] = useState("circulation");

  const load = useCallback(async () => {
    const res = await fetch("/api/schemas");
    const json = (await res.json()) as { models?: Model[] };
    setModels(json.models ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    setMessage("Prof annote le schéma…");
    const form = new FormData();
    form.set("file", file);
    form.set("class_level", classLevel);
    form.set("chapter_id", chapterId);
    const res = await fetch("/api/schemas", { method: "POST", body: form });
    const json = (await res.json()) as { error?: string; model?: Model };
    setBusy(false);
    if (!res.ok) {
      setMessage("");
      setError(json.error || "Impossible d’annoter l’image.");
      return;
    }
    setMessage("Schéma prêt. Corrige les pastilles puis enregistre.");
    await load();
    if (json.model) setActive(json.model);
  };

  const { dragging } = useIncomingFiles({
    accept: IMAGE_ACCEPT,
    enabled: !busy,
    onFile: (file) => void upload(file),
    onError: setError,
  });

  const save = async () => {
    if (!active) return;
    setBusy(true);
    const res = await fetch(`/api/schemas/${active.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });
    setBusy(false);
    setMessage(res.ok ? "Schéma enregistré. Coché web/mobile = visible dans les apps." : "Échec.");
    await load();
  };

  const dropProps = {
    accept: IMAGE_ACCEPT,
    disabled: busy,
    hot: dragging,
    onFile: (file: File) => void upload(file),
    onError: setError,
    hint: "PNG, JPG, WebP — glisse, clique ou colle (Ctrl+V)",
  };

  return (
    <div className="relative grid gap-5 lg:grid-cols-[280px_1fr]">
      {dragging ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
          <p className="rounded-full bg-[#1677FF] px-5 py-2 text-sm font-extrabold text-white shadow-lg">
            Relâche n’importe où pour déposer l’image
          </p>
        </div>
      ) : null}
      <aside className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-4">
        <h2 className="font-black">Nouveau schéma</h2>
        <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="mt-3 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-2 text-sm font-bold">
          {CLASS_GROUPS.map((g) => (
            <optgroup key={g.id} label={g.label}>
              {g.classes.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <input value={chapterId} onChange={(e) => setChapterId(e.target.value)} placeholder="id chapitre (circulation)" className="mt-2 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-3 text-sm font-bold" />
        <div className="mt-3">
          <FileDropZone compact title="Déposer l’image" {...dropProps} />
        </div>
        <ul className="mt-4 space-y-1">
          {models.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setActive(m)} className={`w-full rounded-xl px-3 py-2 text-left text-sm font-bold ${active?.id === m.id ? "bg-[#E6F4FF] text-[#1677FF]" : "text-[#475569]"}`}>
                {m.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section>
        {error ? <p className="mb-3 rounded-2xl bg-[#FEF2F2] px-4 py-2 text-sm font-bold text-[#DC2626]">{error}</p> : null}
        {message ? <p className="mb-3 rounded-2xl bg-[#ECFDF5] px-4 py-2 text-sm font-bold text-[#059669]">{message}</p> : null}
        {!active ? (
          <FileDropZone title="Glisse le schéma ici" {...dropProps} />
        ) : (
          <div className="space-y-3">
            <input value={active.title} onChange={(e) => setActive({ ...active, title: e.target.value })} className="h-11 w-full rounded-2xl border-2 border-[#F0EFEE] px-3 font-black" />
            <div className="relative overflow-hidden rounded-[22px] border-2 border-[#F0EFEE] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.image_url} alt="" className="max-h-[420px] w-full object-contain" />
              {active.parts.map((p) => (
                <span
                  key={p.id}
                  className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1677FF]"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  title={p.label}
                />
              ))}
            </div>
            <textarea
              rows={8}
              value={JSON.stringify(active.parts, null, 2)}
              onChange={(e) => {
                try {
                  setActive({ ...active, parts: JSON.parse(e.target.value) });
                } catch {
                  /* keep */
                }
              }}
              className="w-full rounded-2xl border-2 border-[#F0EFEE] p-3 font-mono text-xs"
            />
            <div className="flex gap-4 text-sm font-bold">
              <label><input type="checkbox" checked={active.publish_web} onChange={(e) => setActive({ ...active, publish_web: e.target.checked })} /> Web</label>
              <label><input type="checkbox" checked={active.publish_mobile} onChange={(e) => setActive({ ...active, publish_mobile: e.target.checked })} /> Mobile</label>
            </div>
            <button type="button" disabled={busy} onClick={() => void save()} className="rounded-2xl bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white">
              Enregistrer
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
