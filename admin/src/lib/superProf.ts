import { classLabel } from "./brand";
import type { InactiveStudent } from "./inactivity";
import { continueLink } from "./relanceTypes";
import type { SuperProfEmail } from "./superProfPrompts";

export type { SuperProfEmail } from "./superProfPrompts";
export { SUPER_PROF_PROMPTS } from "./superProfPrompts";

export type SuperProfReply = {
  text: string;
  email?: SuperProfEmail;
};

export function superProfSystem() {
  return `Tu es Super Prof, l’assistant opérationnel de l’administrateur LearnFlow (Togo, programme APC).

Tu n’es PAS là pour résumer les statistiques. Tu aides à :
1. Rédiger des mails de relance pour les élèves inactifs
2. Préparer l’envoi de ces mails (l’admin clique Envoyer)
3. Faire des revues d’élèves : ce qui bloque, ce qu’il a déjà fait, 3 actions concrètes

Réponds toujours en français, court et concret.

Quand tu rédiges un mail, réponds UNIQUEMENT avec un JSON de cette forme :
{"text":"phrase courte pour l’admin","email":{"subject":"...","body":"texte du mail, sans HTML","studentIds":["id1","id2"]}}

Le body du mail :
- tutoiement, ton encourageant
- mentionne {{absence}} ou le délai réel (semaines)
- inclut exactement cette ligne de lien : ${continueLink()}
- n’invente pas d’élève ni d’email

Si tu ne rédiges pas de mail, réponds :
{"text":"ta réponse","email":null}`;
}

export function parseSuperProfReply(raw: string): SuperProfReply {
  const sliced = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const tryParse = (s: string) => {
    const json = JSON.parse(s) as { text?: string; email?: SuperProfEmail | null };
    const text = typeof json.text === "string" && json.text.trim() ? json.text.trim() : "";
    const email = json.email && json.email.subject && json.email.body
      ? {
          subject: json.email.subject.trim(),
          body: json.email.body.trim(),
          studentIds: Array.isArray(json.email.studentIds) ? json.email.studentIds.filter(Boolean) : [],
        }
      : undefined;
    return { text: text || raw.trim(), email };
  };
  try {
    return tryParse(sliced);
  } catch {
    const match = sliced.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return tryParse(match[0]);
      } catch {
        /* fall through */
      }
    }
    return { text: raw.trim() };
  }
}

export function inactiveContext(inactifs: InactiveStudent[]) {
  if (!inactifs.length) return "Aucun élève inactif (seuil actuel).";
  return inactifs
    .slice(0, 20)
    .map(
      (s) =>
        `- ${s.name} | id=${s.id} | ${classLabel(s.classe)} | ${s.email || "sans email"} | absent ${s.absenceLabel} | ${s.xpTotale} XP | ligue ${s.leagueTier}`,
    )
    .join("\n");
}
