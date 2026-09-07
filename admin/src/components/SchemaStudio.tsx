"use client";

import { useCallback, useEffect, useState } from "react";
import { CLASSES } from "@/lib/brand";
import type { SchemaPart } from "@/lib/contentTypes";

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
    setMessage("Prof annote le schéma…");
    const form = new FormData();
    form.set("file", file);
    form.set("class_level", classLevel);
    form.set("chapter_id", chapterId);
    const res = await fetch("/api/schemas", { method: "POST", body: form });
    const json = (await res.json()) as { error?: string; model?: Model };
    setBusy(false);
    if (!res.ok) {
      setMessage(json.error || "Impossible d’annoter l’image.");
      return;
    }
    setMessage("Schéma prêt. Corrige les pastilles puis enregistre.");
    await load();
    if (json.model) setActive(json.model);
  };

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

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-4">
        <h2 className="font-black">Nouveau schéma</h2>
        <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="mt-3 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-2 text-sm font-bold">
          {CLASSES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <input value={chapterId} onChange={(e) => setChapterId(e.target.value)} placeholder="id chapitre (circulation)" className="mt-2 h-10 w-full rounded-xl border-2 border-[#F0EFEE] px-3 text-sm font-bold" />
        <input
          type="file"
          accept="image/*"
          className="mt-2 w-full text-xs"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
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
        {message ? <p className="mb-3 rounded-2xl bg-[#ECFDF5] px-4 py-2 text-sm font-bold text-[#059669]">{message}</p> : null}
        {!active ? (
          <p className="rounded-[22px] border-2 border-dashed border-[#E7E5E4] p-10 text-center text-sm font-semibold text-[#A8A29E]">
            Envoie une image (cœur, neurone, carte…). Prof pose des pastilles. Tu les déplaces et tu les renommes.
          </p>
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
