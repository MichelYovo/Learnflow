const GEMINI_KEY = (process.env.GEMINI_API_KEY ?? "").trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta";

const FALLBACK_MODELS = [GEMINI_MODEL, "gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

export function isGeminiConfigured() {
  return GEMINI_KEY.length > 8;
}

type GeminiResult = { text?: string; error?: string };

function extractInteractionText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const row = data as {
    output_text?: string;
    outputs?: unknown;
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
  if (parts.length) return parts.join("\n").trim();
  return "";
}

function extractGenerateText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const row = data as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const parts = row.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((p) => p.text ?? "")
    .join("")
    .trim();
}

function parseGeminiHttpError(raw: string, status: number) {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; status?: string } };
    const msg = parsed.error?.message ?? "";
    if (status === 401 || status === 403) return "Clé Gemini invalide. Vérifie GEMINI_API_KEY dans admin/.env.local.";
    if (status === 429) return "Limite Gemini temporaire. Réessaie dans un instant.";
    if (msg) return msg.slice(0, 280);
  } catch {
    /* keep fallback */
  }
  return raw.slice(0, 280) || `Gemini HTTP ${status}`;
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

async function geminiGenerateContent(system: string, user: string): Promise<GeminiResult> {
  let lastError = "Gemini indisponible.";
  for (const model of [...new Set(FALLBACK_MODELS)]) {
    const res = await fetch(`${GEMINI_URL}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "x-goog-api-key": GEMINI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
      }),
    });
    const raw = await res.text();
    if (!res.ok) {
      lastError = parseGeminiHttpError(raw, res.status);
      continue;
    }
    try {
      const text = extractGenerateText(JSON.parse(raw));
      if (text) return { text };
      lastError = "Réponse Gemini vide.";
    } catch {
      lastError = "Réponse Gemini illisible.";
    }
  }
  return { error: lastError };
}

export async function geminiChat(system: string, user: string): Promise<GeminiResult> {
  if (!isGeminiConfigured()) {
    return { error: "Ajoute GEMINI_API_KEY dans admin/.env.local pour Super Prof." };
  }
  const first = await geminiInteractions(system, user);
  if (first.text) return first;
  return geminiGenerateContent(system, user);
}
