import { classLabel } from "./brand";
import type { InactiveStudent } from "./inactivity";

export const DEFAULT_RELANCE_SUBJECT = "Reviens continuer sur LearnFlow";

export const DEFAULT_RELANCE_BODY = `Salut {{prenom}},

Ça fait {{absence}} que tu n’es pas passé sur LearnFlow. Tes cours de {{classe}} t’attendent, et tu as déjà {{xp}} XP — ce serait dommage de t’arrêter là.

Clique sur le lien pour reprendre exactement où tu en étais :
{{lien}}

À tout de suite,
L’équipe LearnFlow`;

export type RelanceTemplate = {
  subject: string;
  body: string;
  updatedAt: string;
};

export type RelanceSend = {
  id: string;
  studentId: string;
  email: string;
  name: string;
  subject: string;
  sentAt: string;
  via?: string;
};

export function studentAppUrl() {
  return (
    process.env.LEARNFLOW_WEB_URL?.trim() ||
    process.env.NEXT_PUBLIC_LEARNFLOW_WEB_URL?.trim() ||
    "http://localhost:3002"
  ).replace(/\/$/, "");
}

export function continueLink() {
  return `${studentAppUrl()}/login?from=relance`;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "toi";
}

export function fillRelanceText(template: string, student: InactiveStudent, link = continueLink()) {
  const map: Record<string, string> = {
    prenom: firstName(student.name),
    nom: student.name,
    classe: classLabel(student.classe),
    xp: String(student.xpTotale),
    serie: String(student.streak),
    absence: student.absenceLabel,
    semaines: student.absenceLabel,
    lien: link,
  };
  return template.replace(/\{\{\s*(prenom|nom|classe|xp|serie|absence|semaines|lien)\s*\}\}/gi, (_, key: string) => {
    return map[key.toLowerCase()] ?? "";
  });
}

export function filledRelance(student: InactiveStudent, template: RelanceTemplate) {
  const link = continueLink();
  return {
    subject: fillRelanceText(template.subject, student, link),
    body: fillRelanceText(template.body, student, link),
    link,
  };
}
