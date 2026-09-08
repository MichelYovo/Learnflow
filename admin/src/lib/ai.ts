const AI_URL = (
  process.env.OPENAI_BASE_URL ??
  process.env.GROQ_BASE_URL ??
  "https://api.groq.com/openai/v1"
).replace(/\/$/, "");

const AI_KEY = (
  process.env.GROQ_API_KEY ??
  process.env.OPENAI_API_KEY ??
  process.env.OPENAI_COMPATIBLE_API_KEY ??
  ""
).trim();

const AI_MODEL = process.env.GROQ_MODEL?.trim() || process.env.OPENAI_MODEL?.trim() || "llama-3.3-70b-versatile";
const AI_VISION_MODEL =
  process.env.GROQ_VISION_MODEL?.trim() || "meta-llama/llama-4-scout-17b-16e-instruct";

export function isAiConfigured() {
  return AI_KEY.length > 8;
}

function parseAiHttpError(raw: string, status: number) {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; code?: string } };
    const msg = parsed.error?.message ?? "";
    if (/credits remaining|quota|billing|insufficient/i.test(msg) || parsed.error?.code === "insufficient_quota") {
      return "Crédits IA épuisés. Vérifie le solde sur console.groq.com puis réessaie.";
    }
    if (msg) return msg;
  } catch {
    /* keep fallback */
  }
  return raw.slice(0, 280) || `IA HTTP ${status}`;
}

export async function chatJson(system: string, user: string, imageDataUrl?: string): Promise<{ json?: unknown; error?: string; text?: string }> {
  if (!isAiConfigured()) {
    return { error: "Ajoute GROQ_API_KEY dans admin/.env.local pour activer Prof et Super Prof." };
  }
  const userContent: unknown = imageDataUrl
    ? [
        { type: "text", text: user },
        { type: "image_url", image_url: { url: imageDataUrl } },
      ]
    : user;

  const res = await fetch(`${AI_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: imageDataUrl ? AI_VISION_MODEL : AI_MODEL,
      temperature: 0.3,
      response_format: imageDataUrl ? undefined : { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
    }),
  });
  if (!res.ok) {
    return { error: parseAiHttpError(await res.text(), res.status) };
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
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

export async function chatText(system: string, user: string): Promise<{ text?: string; error?: string }> {
  if (!isAiConfigured()) {
    return { error: "Ajoute GROQ_API_KEY dans admin/.env.local pour activer Super Prof." };
  }
  const res = await fetch(`${AI_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    return { error: parseAiHttpError(await res.text(), res.status) };
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return { text: data.choices?.[0]?.message?.content?.trim() || "…" };
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
