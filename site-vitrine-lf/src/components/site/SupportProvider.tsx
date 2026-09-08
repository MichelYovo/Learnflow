"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import ContactForm from "./ContactForm";

export type SupportTopic = "support" | "waitlist";

type SupportContextValue = {
  open: (topic?: SupportTopic) => void;
};

const SupportContext = createContext<SupportContextValue>({ open: () => {} });

export function useSupport() {
  return useContext(SupportContext);
}

export default function SupportProvider({ children }: { children: ReactNode }) {
  const [topic, setTopic] = useState<SupportTopic | null>(null);

  const close = useCallback(() => setTopic(null), []);
  const open = useCallback((next: SupportTopic = "support") => setTopic(next), []);
  const value = useMemo(() => ({ open }), [open]);
  const waitlist = topic === "waitlist";

  return (
    <SupportContext.Provider value={value}>
      {children}
      {topic ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0B1B3A]/55 p-4 sm:items-center"
          role="presentation"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-title"
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,.28)]"
            onClick={(ev) => ev.stopPropagation()}
          >
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">
              {waitlist ? "Liste d’attente" : "Nous contacter"}
            </p>
            <h2 id="support-title" className="mt-1 text-2xl font-black text-[#1C1917]">
              {waitlist ? "Préviens-moi" : "Écris-nous"}
            </h2>
            <p className="mt-2 mb-4 text-sm font-medium text-[#64748B]">
              {waitlist
                ? "Ton prénom, ton email, et on te dit quand c’est en ligne."
                : "Un petit message suffit. On te répond à l’email que tu indiques."}
            </p>
            <ContactForm key={topic} topic={topic} />
            <button
              type="button"
              onClick={close}
              className="mt-3 w-full text-center text-sm font-bold text-[#64748B]"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </SupportContext.Provider>
  );
}
