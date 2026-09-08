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

const AI_MODEL = process.env.GROQ_MODEL?.trim() || process.env.OPENAI_MODEL?.trim() || "openai/gpt-oss-120b";
const AI_VISION_MODEL = process.env.GROQ_VISION_MODEL?.trim() || "qwen/qwen3.6-27b";
const AI_MAX_TOKENS = Number(process.env.GROQ_MAX_TOKENS) || 4096;
/** Palier Groq on_demand de Qwen : 1000 OTPM. Au-delà, Groq refuse la requête. */
const AI_VISION_MAX_TOKENS = Number(process.env.GROQ_VISION_MAX_TOKENS) || 800;

type ChatResult = { json?: unknown; error?: string; text?: string };

export function isAiConfigured() {
  return AI_KEY.length > 8;
}

function parseAiHttpError(raw: string, status: number) {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; code?: string; type?: string } };
    const msg = parsed.error?.message ?? "";
    const code = parsed.error?.code ?? "";
    const rateLimited =
      status === 429 ||
      code === "rate_limit_exceeded" ||
      parsed.error?.type === "tokens" ||
      /rate limit|tokens per minute|OTPM|TPM|try again in /i.test(msg);

    if (rateLimited) {
      const wait = msg.match(/try again in ([0-9.]+)\s*s/i)?.[1];
      return wait
        ? `Limite Groq temporaire (tokens / minute). Réessaie dans ${wait} s.`
        : "Limite Groq temporaire (tokens / minute). Réessaie dans un instant, ou réduis l’image.";
    }
    if (status === 401 || code === "invalid_api_key") {
      return "Clé Groq invalide. Vérifie GROQ_API_KEY dans admin/.env.local.";
    }
    if (status === 413 || /payload too large|maximum context|context length/i.test(msg)) {
      return "Fichier ou texte trop lourd pour l’IA. Réduis l’image ou le PDF.";
    }
    if (
      code === "insufficient_quota" ||
      /credits remaining|insufficient (balance|credits)|no credits|payment required/i.test(msg)
    ) {
      return "Compte Groq sans solde pour ce modèle. Ajoute du crédit sur console.groq.com/settings/billing.";
    }
    if (code === "json_validate_failed" || /failed to generate json/i.test(msg)) {
      return "L’IA n’a pas renvoyé un JSON valide. Réessaie.";
    }
    if (msg) return msg.slice(0, 280);
  } catch {
    /* keep fallback */
  }
  return raw.slice(0, 280) || `IA HTTP ${status}`;
}

function assistantText(data: {
  choices?: { message?: { content?: string | null; reasoning?: string } }[];
}) {
  const msg = data.choices?.[0]?.message;
  const content = msg?.content?.trim() ?? "";
  if (content) return content;
  return msg?.reasoning?.trim() ?? "";
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

async function groqChat(body: Record<string, unknown>, attempt = 0): Promise<{ ok: true; data: unknown } | { ok: false; error: string; status: number; raw: string }> {
  const res = await fetch(`${AI_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  if (res.status === 429 && attempt === 0) {
    const waitMs = Math.min(8000, Math.max(1200, Number(res.headers.get("retry-after")) * 1000 || 2000));
    await new Promise((r) => setTimeout(r, waitMs));
    return groqChat(body, 1);
  }
  if (!res.ok) {
    return { ok: false, error: parseAiHttpError(raw, res.status), status: res.status, raw };
  }
  try {
    return { ok: true, data: JSON.parse(raw) };
  } catch {
    return { ok: false, error: "Réponse Groq illisible.", status: res.status, raw };
  }
}

function userContent(user: string, imageDataUrl?: string) {
  if (!imageDataUrl) return user;
  return [
    { type: "text", text: user },
    { type: "image_url", image_url: { url: imageDataUrl } },
  ];
}

export async function chatJson(
  system: string,
  user: string,
  imageDataUrl?: string,
  opts?: { imageDirect?: boolean },
): Promise<ChatResult> {
  if (!isAiConfigured()) {
    return { error: "Ajoute GROQ_API_KEY dans admin/.env.local pour activer Prof et Super Prof." };
  }

  if (imageDataUrl && !opts?.imageDirect) {
    const ocr = await groqChat({
      model: AI_VISION_MODEL,
      temperature: 0.2,
      max_completion_tokens: AI_VISION_MAX_TOKENS,
      messages: [
        {
          role: "system",
          content: "Tu lis une photo de cours (cahier, capture, fiche). Transcris tout le texte visible, en français, sans JSON.",
        },
        { role: "user", content: userContent("Transcris le cours visible sur cette image.", imageDataUrl) },
      ],
    });
    if (!ocr.ok) return { error: ocr.error };
    const extracted = assistantText(ocr.data as Parameters<typeof assistantText>[0]);
    if (!extracted) return { error: "Impossible de lire le texte sur l’image." };
    return chatJson(system, `${user}\n\nTexte lu sur l’image :\n${extracted.slice(0, 12000)}`);
  }

  const res = await groqChat({
    model: imageDataUrl ? AI_VISION_MODEL : AI_MODEL,
    temperature: 0.3,
    max_completion_tokens: imageDataUrl ? AI_VISION_MAX_TOKENS : AI_MAX_TOKENS,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: userContent(user, imageDataUrl) },
    ],
  });
  if (!res.ok) return { error: res.error };
  return parseJsonPayload(assistantText(res.data as Parameters<typeof assistantText>[0]));
}

export async function chatText(system: string, user: string): Promise<{ text?: string; error?: string }> {
  if (!isAiConfigured()) {
    return { error: "Ajoute GROQ_API_KEY dans admin/.env.local pour activer Super Prof." };
  }
  const res = await groqChat({
    model: AI_MODEL,
    temperature: 0.4,
    max_completion_tokens: 1024,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  if (!res.ok) return { error: res.error };
  return { text: assistantText(res.data as Parameters<typeof assistantText>[0]) || "…" };
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
