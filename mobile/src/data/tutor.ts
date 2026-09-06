import { FICHES } from "./fiches";
import { AI_FAQ, findAiFaq } from "./mock";

/** Questions cloud / jour en version gratuite. */
export const AI_DAILY_QUOTA = 5;

export type TutorSource = "faq" | "cloud" | "exhausted";

export type TutorReply = {
  text: string;
  source: TutorSource;
};

export function todayIsoDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function remainingAiQuota(restant: number, day?: string | null, limit = AI_DAILY_QUOTA): number {
  return day === todayIsoDate() ? Math.max(0, restant) : limit;
}

function stripMd(s: string): string {
  return s.replace(/\*\*/g, "").trim();
}

/** Vulgarisation locale à partir des fiches — distincte des analogies Spira. */
export function vulgarizeFromFiches(query: string): string | undefined {
  const q = query.toLowerCase().trim();
  if (q.length < 3) return undefined;

  for (const fiche of Object.values(FICHES)) {
    const keys = (fiche.motsClesMasques ?? []).map((k) => k.toLowerCase());
    const title = fiche.titre.toLowerCase();
    const hit =
      keys.some((k) => k.length > 2 && q.includes(k)) ||
      q.split(/\s+/).some((w) => w.length > 4 && title.includes(w));
    if (!hit) continue;

    const bullets = (fiche.pucesEssentiel ?? []).slice(0, 3).map(stripMd).filter(Boolean);
    if (bullets.length) {
      return `${fiche.titre} — version simple :\n${bullets.map((b) => `• ${b}`).join("\n")}`;
    }
    if (fiche.analogie?.concept) {
      return `${fiche.analogie.concept} : ${fiche.analogie.exemple}`;
    }
  }
  return undefined;
}

export function faqHintList(limit = 6): string {
  return AI_FAQ.slice(0, limit)
    .map((f) => f.q.replace(/\?$/, ""))
    .join(" · ");
}

/**
 * FAQ locale = illimitée, hors ligne.
 * Sinon 1 jeton cloud (quota gratuit), avec vulgarisation fiche si possible.
 */
export function askTutor(query: string, consumeCloud: () => boolean): TutorReply {
  const faq = findAiFaq(query);
  if (faq) return { text: faq.a, source: "faq" };

  const used = consumeCloud();
  if (!used) {
    return {
      text: `Quota cloud épuisé pour aujourd'hui (0/${AI_DAILY_QUOTA}). La FAQ locale reste dispo hors ligne : ${faqHintList()}.`,
      source: "exhausted",
    };
  }

  const fromFiche = vulgarizeFromFiches(query);
  if (fromFiche) return { text: fromFiche, source: "cloud" };

  return {
    text: "Bonne question. Relis l'Essentiel de la fiche, ou choisis une suggestion FAQ (discriminant, cœur, ADN, synapse, 10/10…). Demain tu auras 5 nouvelles questions cloud.",
    source: "cloud",
  };
}
