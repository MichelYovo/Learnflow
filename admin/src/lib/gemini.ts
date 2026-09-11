const GEMINI_KEY = (process.env.GEMINI_API_KEY ?? "").trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MAX_TOKENS = Number(process.env.GEMINI_MAX_TOKENS) || 8192;

const FALLBACK_MODELS = [GEMINI_MODEL, "gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

export function isGeminiConfigured() {
  return GEMINI_KEY.length > 8;
}

type GeminiResult = { text?: string; error?: string };

export type GeminiChatOptions = {
  json?: boolean;
  imageDataUrl?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,([\s\S]+)$/);
  if (!match) return null;
  return { mimeType: match[1] || "image/jpeg", data: match[2].replace(/\s/g, "") };
}

function userParts(user: string, imageDataUrl?: string) {
  const parts: Record<string, unknown>[] = [{ text: user }];
  if (!imageDataUrl) return parts;
  const img = parseDataUrl(imageDataUrl);
  if (img) parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
  return parts;
}

function extractInteractionText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const row = data as {
    output_text?: string;
    steps?: { type?: string; content?: { type?: string; text?: string }[] }[];
  };
  if (typeof row.output_text === "string" && row.output_text.trim()) return row.output_text.trim();
  const parts: string[] = [];
  for (const step of row.steps ?? []) {
    if (step.type && !/model_output|text/i.test(step.type)) continue;
    for (const part of step.content ?? []) {
      if (part.text?.trim()) parts.push(part.text.trim());
    }
  }
  return parts.join("\n").trim();
}

function extractGenerateText(data: unknown): { text: string; error?: string } {
  if (!data || typeof data !== "object") return { text: "" };
  const row = data as {
    promptFeedback?: { blockReason?: string };
    candidates?: {
      finishReason?: string;
      content?: { parts?: { text?: string; thought?: boolean }[] };
    }[];
  };
  const blocked = row.promptFeedback?.blockReason;
  if (blocked) return { text: "", error: `Gemini a bloqué la requête (${blocked}).` };
  const candidate = row.candidates?.[0];
  const finish = candidate?.finishReason ?? "";
  if (/SAFETY|BLOCK|RECITATION/i.test(finish)) {
    return { text: "", error: `Gemini a interrompu la réponse (${finish}).` };
  }
  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  return { text };
}

function parseGeminiHttpError(raw: string, status: number) {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; status?: string } };
    const msg = parsed.error?.message ?? "";
    const code = parsed.error?.status ?? "";
    if (status === 401 || status === 403 || code === "PERMISSION_DENIED") {
      return "Clé Gemini invalide. Vérifie GEMINI_API_KEY dans admin/.env.local.";
    }
    if (status === 429 || code === "RESOURCE_EXHAUSTED") {
      return "Limite Gemini temporaire. Réessaie dans un instant.";
    }
    if (status === 413 || /payload|too large|request entity/i.test(msg)) {
      return "Fichier ou texte trop lourd pour Gemini. Réduis l’image ou le PDF.";
    }
    if (msg) return msg.slice(0, 280);
  } catch {
    /* keep fallback */
  }
  return raw.slice(0, 280) || `Gemini HTTP ${status}`;
}

function shouldFallbackModel(status: number, error: string) {
  if (status === 401 || status === 403) return false;
  if (status === 413) return false;
  return status === 404 || /not found|not supported|unknown model/i.test(error);
}

async function geminiInteractions(system: string, user: string): Promise<GeminiResult> {
  const res = await fetch(`${GEMINI_URL}/interactions`, {
    method: "POST",
    headers: {
      "x-goog-api-key": GEMINI_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      system_instruction: system,
      input: user,
    }),
  });
  const raw = await res.text();
  if (!res.ok) return { error: parseGeminiHttpError(raw, res.status) };
  try {
    const text = extractInteractionText(JSON.parse(raw));
    return text ? { text } : { error: "Réponse Gemini vide." };
  } catch {
    return { error: "Réponse Gemini illisible." };
  }
}

async function geminiGenerateContent(
  system: string,
  user: string,
  opts?: GeminiChatOptions,
  attempt = 0,
): Promise<GeminiResult> {
  let lastError = "Gemini indisponible.";
  const generationConfig: Record<string, unknown> = {
    temperature: opts?.temperature ?? (opts?.json ? 0.3 : 0.4),
    maxOutputTokens: opts?.maxOutputTokens ?? (opts?.json ? GEMINI_MAX_TOKENS : 2048),
  };
  if (opts?.json) generationConfig.responseMimeType = "application/json";

  for (const model of [...new Set(FALLBACK_MODELS)]) {
    const res = await fetch(`${GEMINI_URL}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "x-goog-api-key": GEMINI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: userParts(user, opts?.imageDataUrl) }],
        generationConfig,
      }),
    });
    const raw = await res.text();
    if (res.status === 429 && attempt === 0) {
      await new Promise((r) => setTimeout(r, 2000));
      return geminiGenerateContent(system, user, opts, 1);
    }
    if (!res.ok) {
      lastError = parseGeminiHttpError(raw, res.status);
      if (!shouldFallbackModel(res.status, lastError)) return { error: lastError };
      continue;
    }
    try {
      const extracted = extractGenerateText(JSON.parse(raw));
      if (extracted.error) return extracted;
      if (extracted.text) return { text: extracted.text };
      lastError = "Réponse Gemini vide.";
    } catch {
      lastError = "Réponse Gemini illisible.";
    }
  }
  return { error: lastError };
}

export async function geminiChat(system: string, user: string, opts?: GeminiChatOptions): Promise<GeminiResult> {
  if (!isGeminiConfigured()) {
    return { error: "Ajoute GEMINI_API_KEY dans admin/.env.local pour activer Prof et Super Prof." };
  }
  if (opts?.imageDataUrl && !parseDataUrl(opts.imageDataUrl)) {
    return { error: "Image illisible pour Gemini." };
  }
  if (opts?.json || opts?.imageDataUrl) {
    return geminiGenerateContent(system, user, opts);
  }
  const first = await geminiInteractions(system, user);
  if (first.text) return first;
  return geminiGenerateContent(system, user, opts);
}
