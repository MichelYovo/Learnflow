"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "user" | "prof"; text: string };

export default function SuperProfChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "prof", text: "Super Prof ici. Pose-moi une question sur les élèves, les ligues, ou un brouillon de cours." },
  ]);

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    const res = await fetch("/api/super-prof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, path: pathname }),
    });
    const json = (await res.json()) as { text?: string; error?: string };
    setBusy(false);
    setMsgs((m) => [...m, { role: "prof", text: json.text || json.error || "Super Prof n’a pas répondu." }]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1677FF] text-[11px] font-black leading-tight text-white shadow-lg"
        aria-label="Ouvrir Super Prof"
      >
        SP
      </button>
      {open ? (
        <div className="fixed bottom-24 right-5 z-40 flex h-[420px] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[22px] border-2 border-[#F0EFEE] bg-white shadow-xl">
          <div className="flex items-center justify-between bg-[#1677FF] px-4 py-3 text-white">
            <p className="text-sm font-extrabold">Super Prof · assistant admin</p>
            <button type="button" onClick={() => setOpen(false)} className="text-sm font-black">
              ×
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm font-medium ${
                  m.role === "user" ? "ml-auto bg-[#1677FF] text-white" : "bg-[#F8FAFC] text-[#1C1917]"
                }`}
              >
                {m.text}
              </p>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-[#F0EFEE] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Demande à Super Prof…"
              className="h-10 flex-1 rounded-xl border-2 border-[#F0EFEE] px-3 text-sm outline-none"
            />
            <button type="submit" disabled={busy} className="rounded-xl bg-[#1677FF] px-3 text-sm font-extrabold text-white">
              OK
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
