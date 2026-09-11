"use client";

import { useEffect, useState } from "react";

type Notice = { id: string; title: string; body: string; created_at: string };

export default function EditorNoticePanel() {
  const [title, setTitle] = useState("Message de l’éditeur");
  const [body, setBody] = useState(
    "L’accueil et les cours sont de nouveau disponibles. Bonne révision — l’équipe LearnFlow.",
  );
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");
  const [notices, setNotices] = useState<Notice[]>([]);

  const load = async () => {
    const res = await fetch("/api/notices");
    const json = (await res.json()) as { notices?: Notice[]; error?: string };
    if (Array.isArray(json.notices)) setNotices(json.notices);
  };

  useEffect(() => {
    void load();
  }, []);

  const send = async () => {
    setBusy(true);
    setError("");
    setFlash("");
    const res = await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    const json = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Envoi impossible.");
      return;
    }
    setFlash("Notification envoyée. Les élèves la verront dans leur cloche.");
    void load();
  };

  return (
    <article className="rounded-[22px] border-2 border-[#E6F4FF] bg-white p-5">
      <h2 className="text-base font-black text-[#1C1917]">Notification dans l’app</h2>
      <p className="mt-1 text-sm font-medium text-[#64748B]">
        Message de l’éditeur : il apparaît dans la cloche des élèves (accueil).
      </p>
      <label className="mt-4 block text-sm font-bold text-[#1C1917]">
        Titre
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 h-11 w-full rounded-2xl border-2 border-[#F0EFEE] px-3 text-sm outline-none focus:border-[#1677FF]"
        />
      </label>
      <label className="mt-3 block text-sm font-bold text-[#1C1917]">
        Message
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-2xl border-2 border-[#F0EFEE] px-3 py-3 text-sm leading-relaxed outline-none focus:border-[#1677FF]"
        />
      </label>
      {error ? <p className="mt-3 text-sm font-bold text-[#EF4444]">{error}</p> : null}
      {flash ? <p className="mt-3 text-sm font-bold text-[#10B981]">{flash}</p> : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => void send()}
        className="mt-4 rounded-2xl bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
      >
        {busy ? "Envoi…" : "Envoyer aux élèves"}
      </button>
      {notices.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {notices.slice(0, 5).map((n) => (
            <li key={n.id} className="rounded-xl bg-[#F8FAFC] px-3 py-2">
              <p className="text-sm font-extrabold text-[#1C1917]">{n.title}</p>
              <p className="text-xs font-semibold text-[#64748B]">{n.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
