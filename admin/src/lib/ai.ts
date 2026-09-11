import { geminiChat, isGeminiConfigured } from "./gemini";

type ChatResult = { json?: unknown; error?: string; text?: string };

export function isAiConfigured() {
  return isGeminiConfigured();
}

function parseJsonPayload(text: string): ChatResult {
  if (!text) return { error: "Réponse IA vide." };
  const sliced = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    return { json: JSON.parse(sliced), text };
  } catch {
    const match = sliced.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return { json: JSON.parse(match[0]), text };
      } catch {
        /* fall through */
      }
    }
    return { text, error: "JSON IA illisible." };
  }
}

export async function chatJson(
  system: string,
  user: string,
  imageDataUrl?: string,
  _opts?: { imageDirect?: boolean },
): Promise<ChatResult> {
  if (!isAiConfigured()) {
    return { error: "Ajoute GEMINI_API_KEY dans admin/.env.local pour activer Prof et Super Prof." };
  }
  const ai = await geminiChat(system, user, {
    json: true,
    imageDataUrl,
    temperature: 0.3,
  });
  if (!ai.text) return { error: ai.error || "Gemini n’a pas répondu." };
  return parseJsonPayload(ai.text);
}

export async function chatText(system: string, user: string): Promise<{ text?: string; error?: string }> {
  if (!isAiConfigured()) {
    return { error: "Ajoute GEMINI_API_KEY dans admin/.env.local pour Super Prof." };
  }
  const ai = await geminiChat(system, user, { temperature: 0.4, maxOutputTokens: 2048 });
  if (ai.text) return ai;
  return { error: ai.error || "Gemini n’a pas répondu." };
}

/** Extraire le texte d’un PDF sans dépendance (flux entre parenthèses). */
export function extractPdfText(buffer: Buffer): string {
  const raw = buffer.toString("latin1");
  const out: string[] = [];
  const re = /\((?:\\.|[^\\)])+\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw))) {
    const inner = match[0].slice(1, -1);
    const decoded = inner
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
    if (/[a-zA-ZÀ-ÿ]{3,}/.test(decoded)) out.push(decoded);
  }
  const joined = out.join(" ").replace(/\s+/g, " ").trim();
  return joined.slice(0, 24_000);
}
